import { FullPageLoader } from '../components/loaders/LoaderComponents';

export default function Loading() {
  return (
    <FullPageLoader
      show={true}
      logoSrc="/logo.png"
      title="Loading"
      subtitle="Please wait..."
    />
  );
}
