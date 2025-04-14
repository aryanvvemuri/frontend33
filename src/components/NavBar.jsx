import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  return (
    <nav className="nav-bar">
      <Link to="/menu/1"> Menu</Link>
      <Link to="/cart"> Cart</Link>
      <Link to="/manager"> Manager</Link>

    </nav>
  );
}

export default NavBar;
