import { AxiosError } from 'axios';
import { action, computed, makeObservable, observable } from 'mobx';
import qs from 'qs';
import * as R from 'remeda';
import type * as Toolbelt from 'ts-toolbelt';

import { Activity, ActivityResponse } from '@model/activity';
import { Comment, CommentsResponse } from '@model/comments';
import { Tournament, TournamentResponse } from '@model/tournaments';

import type { RootStore } from '../RootStore';
import { FilterStore } from './FilterStore';
import { testAnticheater } from './test_anticheater';

type Teams = Record<string | number, { key: string; value: string }[]>;

const PAGINATION_ITEMS_COUNT_PER_PAGE = 10;
const TEST = false;

export class AnticheaterStore {
  constructor(rootStore: RootStore) {
    makeObservable(this);

    this.rootStore = rootStore;
    this.filterStore = new FilterStore(this.rootStore);
  }

  private rootStore: RootStore;

  public filterStore: FilterStore;

  @observable tracks: ActivityResponse | null = null;

  @observable tournaments: Tournament[] | null = null;

  @observable areTracksLoading = false;

  @observable areTournamentsLoading = false;

  @observable teams: Teams = {};

  @observable selectedTournament: Tournament | null = null;

  @observable comments: Record<string, Comment[]> = {};

  @computed
  public get totalPages(): number {
    return Math.ceil(this.tracks?.meta.pages ?? 0);
  }

  @computed
  public get tournamentsById() {
    return (
      this.tournaments?.reduce<Record<number, Tournament>>((acc, tournament) => {
        return { ...acc, [tournament.id]: tournament };
      }, {}) ?? {}
    );
  }

  private constructAnticheaterItemsQueryString = (page = 0): string => {
    const filtersParams = this.filterStore.constructDataQuery();

    return qs.stringify(
      {
        per_page: PAGINATION_ITEMS_COUNT_PER_PAGE,
        page: page ?? this.tracks?.meta.page ?? 0,
        ...filtersParams,
      },
      { arrayFormat: 'brackets' },
    );
  };

  getTracks = async (page = 0) => {
    if (this.areTracksLoading) {
      return;
    }

    const params = this.constructAnticheaterItemsQueryString(page);
    try {
      if (TEST) {
        const res = testAnticheater;
        this.setTracks(res as unknown as ActivityResponse);
      } else {
        this.setTracksIsLoading(true);
        const res = await this.rootStore.apiStore.get<ActivityResponse>(
          `/anticheater?${params}`,
          {},
        );
        this.setTracksIsLoading(false);

        this.setTracks({
          meta: res.data.meta,
          items: res.data.items.filter(i => i.track.files.length > 1),
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        this.rootStore.notificationsStore.addNotification({
          title: `Network error ${error.code}`,
          content: error.message,
          variant: 'danger',
        });
      }
      this.setTracksIsLoading(false);
    }
  };

  getTournaments = async () => {
    this.setTournamentsIsLoading(true);
    try {
      const {
        data: {
          data: { items },
        },
      } = await this.rootStore.apiStore.get<TournamentResponse>('/event/index', {});
      this.setTournaments(items ?? null);
      this.setTournamentsIsLoading(false);
    } catch (e) {
      if (e instanceof Error) {
        this.rootStore.notificationsStore.addNotification({
          title: 'Ошибка в запросе турниров',
          content: e.message,
          variant: 'danger',
        });
      }
    }

    this.setTournamentsIsLoading(false);
  };

  requestComment = async (eventID: number, trackID: number) => {
    const val = await this.rootStore.apiStore.get<CommentsResponse>(
      `/anticheater/comments?track_id=${trackID}&event_id=${eventID}`,
    );
    return val.data;
  };

  requestToggleManual = async (eventID: number, trackID: number) => {
    const val = await this.rootStore.apiStore.post(
      `/anticheater/toggle-manual?track_id=${trackID}&event_id=${eventID}`,
    );
    return val.data;
  };

  requestToggleGPS = async (eventID: number, trackID: number) => {
    const val = await this.rootStore.apiStore.post<CommentsResponse>(
      `/anticheater/toggle-gps?track_id=${trackID}&event_id=${eventID}`,
    );
    return val.data;
  };

  requestToggleCheater = async (eventID: number, trackID: number) => {
    const val = await this.rootStore.apiStore.post<CommentsResponse>(
      `/anticheater/toggle-cheater?track_id=${trackID}&event_id=${eventID}`,
    );
    return val.data;
  };

  requestToggleChecked = async (eventID: number, trackID: number) => {
    const val = await this.rootStore.apiStore.post<CommentsResponse>(
      `/anticheater/toggle-checked?track_id=${trackID}&event_id=${eventID}`,
    );
    return val.data;
  };

  requestToggleStanding = async (eventID: number, trackID: number) => {
    const val = await this.rootStore.apiStore.post<CommentsResponse>(
      `/anticheater/toggle-standing?track_id=${trackID}&event_id=${eventID}`,
      { message: 'test' },
    );
    return val.data;
  };

  requestRemoveTrack = async (eventID: number, trackID: number) => {
    const val = await this.rootStore.apiStore.del<CommentsResponse>(
      `/anticheater/delete?track_id=${trackID}&event_id=${eventID}`,
      { message: 'test' },
    );
    return val.data;
  };

  sendComment = async (eventID: number, trackID: number, content: string) => {
    await this.rootStore.apiStore.post(`/anticheater/comment`, {
      event_id: eventID,
      track_id: trackID,
      content,
    });

    const track = this.tracks?.items.find(q => q.event_id === eventID && q.track.id === trackID);

    this.updateTrack(eventID, trackID, {
      extra: { admin_comment_count: (track?.extra.admin_comment_count ?? 0) + 1 },
    });
  };

  toggleManual = async (eventID: number, trackID: number, manual: boolean) => {
    await this.requestToggleManual(eventID, trackID);

    this.updateTrack(eventID, trackID, { extra: { manual } });
  };

  toggleGPS = async (eventID: number, trackID: number, hasGPS: boolean) => {
    await this.requestToggleGPS(eventID, trackID);

    this.updateTrack(eventID, trackID, { extra: { gps: hasGPS } });
  };

  toggleIsCheater = async (eventID: number, trackID: number, isChater: boolean) => {
    await this.requestToggleCheater(eventID, trackID);

    this.updateTrack(eventID, trackID, { extra: { cheater: isChater } });
  };

  toggleIsChecked = async (eventID: number, trackID: number, isChecked: boolean) => {
    await this.requestToggleChecked(eventID, trackID);

    this.updateTrack(eventID, trackID, { extra: { checked: isChecked } });
  };

  toggleIsStanding = async (eventID: number, trackID: number, isStanding: boolean) => {
    await this.requestToggleStanding(eventID, trackID);

    this.updateTrack(eventID, trackID, { standing: { standing: { stood: isStanding } } });
  };

  deleteTrack = async (eventID: number, trackID: number) => {
    try {
      await this.requestRemoveTrack(eventID, trackID);
      this.rootStore.notificationsStore.addNotification({
        content: `Запись ${eventID} ${trackID} удалена`,
        title: 'Запись удалена',
        variant: 'success',
      });
      this.removeTrack(eventID, trackID);
    } catch (e: unknown) {
      let error = '';
      if (e instanceof Error) {
        error = e.message;
      }
      this.rootStore.notificationsStore.addNotification({
        content: `Проблема при удалении записи ${trackID}: ${error}`,
        title: 'Ошибка',
        variant: 'danger',
      });
    }
  };

  @action.bound
  updateTrack(
    eventID: number,
    id: number,
    anticheaterItem: Toolbelt.Object.Partial<Activity, 'deep'>,
  ) {
    const trackIndex = this.tracks?.items.findIndex(
      item => item.event_id === eventID && item.track.id === id,
    );

    if (trackIndex === undefined) {
      return;
    }

    const t = this.tracks?.items[trackIndex];
    if (!t) {
      return;
    }

    const mergedTrack = R.mergeDeep(t, anticheaterItem) as Activity;

    if (this.tracks) {
      this.tracks.items[trackIndex] = mergedTrack;
    }
  }

  @action.bound
  removeTrack(eventID: number, trackID: number): void {
    const trackIndex = this.tracks?.items.findIndex(
      item => item.event_id === eventID && item.track.id === trackID,
    );

    if (trackIndex === undefined) {
      return;
    }

    if (this.tracks) {
      this.tracks.items.splice(trackIndex, 1);
    }
  }

  @action.bound
  setTournaments = (tournaments: Tournament[] | null) => {
    this.tournaments = tournaments;

    if (!tournaments) {
      this.filterStore.filters.event_id.setValues([]);

      return;
    }
    this.filterStore.filters.event_id.setValues(
      tournaments.map(item => ({ key: String(item.id), value: item.name })),
    );

    const teams: Teams = {};
    const groups: Record<string, { groupName: string }> = {};

    tournaments.forEach(tournament => {
      const tournamentTeams = (tournament.teams ?? []).map(team => ({
        key: String(team.id),
        value: team.name,
        groupKey: tournament.id,
      }));

      teams[tournament.id] = tournamentTeams;
      groups[tournament.id] = { groupName: tournament.name };
    });

    this.teams = teams;

    this.filterStore.filters.team_id.setValues(Object.values(teams).flat());
    this.filterStore.filters.team_id.setGroups(groups);
  };

  @action.bound
  setTracksIsLoading(isLoading: boolean) {
    this.areTracksLoading = isLoading;
  }

  @action.bound
  setTournamentsIsLoading(isLoading: boolean) {
    this.areTournamentsLoading = isLoading;
  }

  @action.bound
  setTracks = (tournaments: ActivityResponse) => {
    this.tracks = tournaments;
  };
}
