import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from './Icon';

type NavItemProps = {
  to: string;
  iconName: React.ComponentProps<typeof Icon>['name'];
  label: string;
};

const NavItem: React.FC<NavItemProps> = ({ to, iconName, label }) => {
  const commonClasses = "flex items-center px-4 py-3 text-sm font-medium transition-colors duration-300 transform rounded-lg";
  
  const activeLink = "bg-blue-600 text-white shadow-lg";
  const inactiveLink = "text-gray-300 hover:bg-blue-700 hover:text-white";

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${commonClasses} ${isActive ? activeLink : inactiveLink}`}
    >
      <Icon name={iconName} className="w-6 h-6" />
      <span className="mx-4 font-semibold">{label}</span>
    </NavLink>
  );
};

export default NavItem;
