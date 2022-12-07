import './Sidebar.scss';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../../../store/auth-context';
import AuthUtil from '../../../../utils/auth';

const Sidebar = props => {
    const authCtx = useContext(AuthContext)
    const session = AuthUtil.getTokenData(authCtx.token);
    const role = session ? session["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : undefined

    const studentAccess = [
        <li>
            <NavLink activeClassName='active' to='/assignments'>Assignments</NavLink>
        </li>
    ]

    const teacherAccess = [
        <li>
            <NavLink activeClassName='active' to='/risk-profiles'>Risk profiles</NavLink>
        </li>,
        <li>
            <NavLink activeClassName='active' to='/students'>Students</NavLink>
        </li>,
        <li>
            <NavLink activeClassName='active' to='/assignments'>Assignments</NavLink>
        </li>
    ]

    const allAccess = [
        <li>
            <NavLink activeClassName='active' to='/risk-profiles'>Risk profiles</NavLink>
        </li>,
        <li>
            <NavLink activeClassName='active' to='/users'>Users</NavLink>
        </li>,
        <li>
            <NavLink activeClassName='active' to='/courses'>Courses</NavLink>
        </li>,
        <li>
            <NavLink activeClassName='active' to='/students'>Students</NavLink>
        </li>,
        <li>
            <NavLink activeClassName='active' to='/assignments'>Assignments</NavLink>
        </li>
    ]

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
                {role === "Student" && studentAccess}
                {role === "Teacher" && teacherAccess}
                {role !== "Student" && role !== "Teacher" && allAccess}
            </ul>
        </div>
    );
}

export default Sidebar;