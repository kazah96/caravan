import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { buttons, utils } from '@components/ui';
import { useRootStore } from '@hooks/useRootStore';
import { Comment } from '@model/comments';
import CloseIcon from '@assets/icons/Close/Close.svg?react';

type Props = {
  eventID: number;
  trackID: number;
  show: boolean;
  commentsCount: number;
  handleClose: () => void;
  handleSave: (comment: string) => void;
};

const CommentaryModal = observer(function CommentaryModal(props: Props) {
  const { handleClose, show, trackID, eventID, commentsCount } = props;
  const [text, setText] = useState('');

  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentUploading, setIsCommentUploading] = useState(false);
  const [areCommensLoading, setAreCommentsLoading] = useState(false);

  const {
    anticheaterStore: { requestComment, sendComment },
  } = useRootStore();

  useEffect(() => {
    if (show) {
      setAreCommentsLoading(true);

      fetchComments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <utils.modal show={show} onHide={handleClose}>
      <article className="rounded-lg border bg-white flex flex-col shadow-xl max-h-[500px]">
        <header className="flex justify-between items-center border-b p-4">
          <h2 className="font-bold text-2xl">Комментарии</h2>{' '}
          <button aria-label="Close" type="button" onClick={handleClose}>
            <CloseIcon className="me-2" />
          </button>
        </header>
        <section className="h-full overflow-y-scroll">
          {!!areCommensLoading && !!commentsCount && (
            <div className="p-4">
              {new Array(commentsCount).fill('').map((_, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={idx} className="skeleton mb-2 " style={{ height: 60 }} />
              ))}
            </div>
          )}

          {!areCommensLoading &&
            comments.map(comment => (
              <div key={comment.id} className="border-b p-4 mb-2">
                <div className="flex-nowrap flex items-center justify-between">
                  <div className="flex pe-4 truncate">
                    <img
                      src={comment.user.avatar}
                      alt=""
                      className="rounded-circle w-[40px] h-[40px] rounded-full"
                    />
                    <div className="ps-2 truncate">
                      <h6 className="font-bold m-0 text-start lh-1 text-black">
                        {comment.user.full_name}
                      </h6>
                      <h6 className="m-0 text-start lh-2 text-nowrap text-truncate fs-6 fw-normal">
                        {comment.created_at}
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="text-black mt-1">{comment.content}</div>
              </div>
            ))}
        </section>
        <section className="p-4">
          <textarea
            className="border rounded-lg p-3 resize-none w-full min-h-[93px]"
            placeholder="Введите комментарий"
            aria-label="Username"
            aria-describedby="basic-addon1"
            onChange={val => setText(val.target.value ?? '')}
            value={text}
          />
          <buttons.filled
            onClick={() => {
              saveComment();
            }}
            type="button"
            disabled={isCommentUploading || text.length === 0}
            className="!bg-amber-300 disabled:opacity-70 mt-4"
          >
            Сохранить
          </buttons.filled>
        </section>
      </article>
    </utils.modal>
  );

  async function fetchComments() {
    const data = await requestComment(eventID, trackID);

    setAreCommentsLoading(false);
    setComments(data.items);
  }

  async function saveComment() {
    setText('');
    setIsCommentUploading(true);
    await sendComment(eventID, trackID, text);
    await fetchComments();
    setIsCommentUploading(false);
  }
});

export { CommentaryModal };
