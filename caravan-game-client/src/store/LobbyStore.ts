import { computed, action, makeObservable, observable } from 'mobx';
import { Caravan, Card, Players } from '@model/base';
import { mapToObj } from 'remeda';
import { WebsocketStore } from './api/WebsocketStore';

type Player = {
  player_id: string;
  name: string;
  client_id: string;
  state: 'WAITING_FOR_GAME' | 'IN_GAME' | 'IN_LOBBY';
};

export class LobbyStore {
  constructor(private readonly socket: WebsocketStore) {
    makeObservable(this);

    this.socket.events.addListener('players/update_players', data =>
      this.handlePlayersUpdate(data),
    );

    this.socket.events.addListener('rooms/update_rooms', data => this.setRooms(data));
    this.socket.events.addListener('players/whoami', data => this.setMyPlayer(data));
  }

  @observable myPlayer: Player | null = null;

  @observable public players: Player[] = [];

  @observable public rooms: Record<
    string,
    { players: string[]; name: string; player_count: number }
  > = {};

  joinRoom = async (name: string) => {
    await this.socket.sendRequest('rooms/connect_to_room', { room_name: name });
  };

  @action.bound
  handlePlayersUpdate(data: Player[]) {
    this.players = data;
  }

  requestRooms = async () => {
    try {
      const data = await this.socket.sendRequest('rooms/get_all_rooms', {});
      this.setRooms(data);
    } catch (e) {
      this.setRooms({});
    }
  };

  createRoom = (roomName: string) => {
    this.socket.sendRequest('rooms/create_new_room', { room_name: roomName });
  };

  requestMyPlayer = async () => {
    const myPlayer = (await this.socket.sendRequest('players/whoami', {})) as Player;
    this.setMyPlayer(myPlayer);
  };

  @action.bound
  setMyPlayer(player: Player) {
    this.myPlayer = player;
  }

  @action.bound
  setRooms(data: Record<string, { players: string[]; name: string; player_count: number }>) {
    this.rooms = data;
  }
}
