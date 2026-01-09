import PremiumLoader from '../components/PremiumLoader';

export default function Loading() {
  return (
    <div className='loading-page-container'>
      <PremiumLoader message='Loading...' size='large' showText={true} />
    </div>
  );
}
