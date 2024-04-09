import { buttons, utils } from '@components/ui';
import CloseIcon from '@assets/icons/Close/Close.svg?react';

type Props = {
  show: boolean;
  name: string;
  date: string;
  distance: number;
  handleClose: () => void;
  handleDelete: () => void;
};

export function RemoveActivityModal(props: Props) {
  const { show, date, name, distance, handleClose, handleDelete } = props;

  return (
    <utils.modal onHide={handleClose} show={show}>
      <article className="rounded-lg border bg-white flex flex-col shadow-xl ">
        <header className="flex justify-between items-center border-b p-4">
          <h2 className="font-bold text-2xl">Удаление активности</h2>{' '}
          <button aria-label="Close" type="button" onClick={handleClose}>
            <CloseIcon className="me-2" />
          </button>
        </header>
        <section className="p-4">
          <div className="text-gray-600">
            Вы уверены, что хотите удалить трек {name}, {date}, {distance}км?
          </div>
        </section>
        <section className="flex gap-4 p-4">
          <buttons.filled
            onClick={handleClose}
            type="button"
            className="!bg-gray-300 disabled:opacity-70 mt-4"
          >
            Отмена
          </buttons.filled>
          <buttons.filled
            onClick={handleDelete}
            type="button"
            className="!bg-amber-300 disabled:opacity-70 mt-4"
          >
            Удалить
          </buttons.filled>
        </section>
      </article>
    </utils.modal>
  );
}
