import { useEffect, type ReactNode } from 'react';
import UnderConstructionBanner from './components/UnderConstructionBanner';
import PortfolioPage from './components/site/PortfolioPage';
import StatusScreen from './components/site/StatusScreen';
import { Atmosphere } from './components/site/ui';
import { fetchPortfolio, setLoadFailed } from './store/portfolioSlice';
import { useAppDispatch, useAppSelector } from './store';

const WIP_BANNER_CONTACT = {
  fullName: 'Divya Shiral',
  phone: '+91-9922328647',
  email: 'shiraldivya25@gmail.com',
};

function App() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.portfolio);

  useEffect(() => {
    dispatch(fetchPortfolio());
  }, [dispatch]);

  useEffect(() => {
    if (!loading) return;
    const timeout = setTimeout(() => {
      dispatch(setLoadFailed({ error: 'Request timed out' }));
    }, 10000);
    return () => clearTimeout(timeout);
  }, [loading, dispatch]);

  let content: ReactNode;
  if (loading) {
    content = <StatusScreen title="Loading portfolio" />;
  } else if (!data) {
    content = error ? (
      <StatusScreen
        title="Something went wrong"
        body={error}
        action={
          <button type="button" className="btn btn-primary mt-6" onClick={() => dispatch(fetchPortfolio())}>
            Try again
          </button>
        }
      />
    ) : (
      <UnderConstructionBanner
        fullName={WIP_BANNER_CONTACT.fullName}
        phone={WIP_BANNER_CONTACT.phone}
        email={WIP_BANNER_CONTACT.email}
      />
    );
  } else if (data.showWIPBanner) {
    content = (
      <UnderConstructionBanner
        fullName={data.fullName ?? WIP_BANNER_CONTACT.fullName}
        phone={data.phone ?? WIP_BANNER_CONTACT.phone}
        email={data.email ?? WIP_BANNER_CONTACT.email}
      />
    );
  } else {
    content = <PortfolioPage data={data} />;
  }

  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-canvas text-ink">
      <Atmosphere />
      {content}
    </div>
  );
}

export default App;
