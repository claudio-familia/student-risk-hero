import './Sidebar.scss';
import { NavLink } from 'react-router-dom';

const Sidebar = props => {
    const usd = 54
    const eu = 54
    return (
        <div className="srhero__sidebar">
            <ul>
                <li className='srhero__divisas'>
                    <h3>Divisas:</h3>
                    <ul>
                        <li><span>US:</span> {usd} DOP</li>
                        <li><span>EU:</span> {eu} DOP</li>
                    </ul>
                </li>
                <li>
                    <NavLink activeClassName='active' to='/risk-profiles'>Risk profiles</NavLink>
                </li>
                <li>
                    <NavLink activeClassName='active' to='/users'>Users</NavLink>
                </li>
                <li>
                    <NavLink activeClassName='active' to='/courses'>Courses</NavLink>
                </li>
                <li>
                    <NavLink activeClassName='active' to='/students'>Students</NavLink>
                </li>
                <li>
                    <NavLink activeClassName='active' to='/assignments'>Assignments</NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;