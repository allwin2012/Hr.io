import Dashboard from '../../pages/Dashboard';
import Profile from '../../pages/Profile';
import Leaves from '../../pages/Leaves';
import Tasks from '../../pages/Tasks';
import Documents from '../../pages/Documents';
import Salary from '../../pages/Salary';
import Kudos from '../../pages/Kudos';
import Settings from '../../pages/Settings';

type PageContentProps = {
  page: 'dashboard' | 'profile' | 'leaves' | 'tasks' | 'documents' | 'salary' | 'kudos' | 'settings';
};

const PageContent = ({ page }: PageContentProps) => {
  switch (page) {
    case 'dashboard': return <Dashboard />;
    case 'profile': return <Profile />;
    case 'leaves': return <Leaves />;
    case 'tasks': return <Tasks />;
    case 'documents': return <Documents />;
    case 'salary': return <Salary />;
    case 'kudos': return <Kudos />;
    case 'settings': return <Settings />;
    default: return <Dashboard />;
  }
};

export default PageContent;
