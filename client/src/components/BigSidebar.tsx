import { useAppContext } from '../context/appContext';
import NavLinks from './NavLinks';
import Wrapper from '../assets/wrappers/BigSidebar';

const BigSidebar: React.FC = () => {
  const { showSidebar } = useAppContext();
  return (
    <Wrapper>
      <div
        className={
          showSidebar ? 'sidebar-container ' : 'sidebar-container show-sidebar'
        }
      >
        <div className="content">
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  );
};

export default BigSidebar;
