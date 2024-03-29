import { NavLink } from '@remix-run/react';

export const Navigation = () => {
	return (
		<nav className="navigation">
			<NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/">
				Read
			</NavLink>
			<NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/feed">
				Feeds
			</NavLink>
			<NavLink className={({ isActive }) => (isActive ? 'active' : '')} to="/delivery">
				Delivery
			</NavLink>
		</nav>
	);
};
