import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { formatDistance } from 'date-fns';
import AddComment from './AddComment';

export default function Comments({
	docId,
	comments: allComments,
	posted,
	commentInput,
}) {
	const [comments, setComments] = useState(allComments);
	console.log('🚀 ~ file: Comments.js ~ line 14 ~ comments', comments);

	return (
		<>
			<div className='p-4 pt-1 pb-4'>
				{comments.length >= 3 && (
					<p className='text-small text-gray-base mb-1 cursor-pointer'>
						view all comments
					</p>
				)}
				{comments.map((item) => (
					<p key={`${item.comment}-${item.displayName}`} className='mb-1'>
						<Link to={`/p/${item.displayName}`}>
							<span className='mr-1 font-bold'>{item.displayName}</span>
						</Link>
						<span>{item.comment}</span>
					</p>
				))}
				<p className='text-gray-base uppercase text-xs mt-2'>
					{formatDistance(posted, new Date())} ago
				</p>
			</div>
			<AddComment
				docId={docId}
				comments={comments}
				setComments={setComments}
				commentInput={commentInput}
			/>
		</>
	);
}

Comments.propTypes = {
	docId: PropTypes.string.isRequired,
	comments: PropTypes.array.isRequired,
	posted: PropTypes.number.isRequired,
	commentInput: PropTypes.object.isRequired,
};
