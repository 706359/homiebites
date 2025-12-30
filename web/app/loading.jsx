import Loader from '../components/Loader';

import './Loading.css';

export default function Loading() {
  return (
    <div className='loading-page-container'>
      <Loader fullScreen={false} size='large' />
    </div>
  );
}
