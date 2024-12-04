import  { useState } from 'react';
import { AppBar, Toolbar, InputBase, IconButton, Badge, Avatar } from '@mui/material';
import { Search as SearchIcon, Notifications as NotificationsIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { assets } from '../../../assets/assets';
const AdminNavbar = () => {
    const [searchFocused, setSearchFocused] = useState(false);
    return (
      <AppBar position="fixed" sx={{backgroundColor:'#111827',zIndex: 1200}}>
        <Toolbar className="justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img src={assets.logo} alt="Gemas DeLujo" className="h-8 mr-2" />
          </div>
  
          {/* Search Bar */}
          <motion.div 
            className={`flex items-center bg-gray-800 rounded-full px-3 py-1 ${searchFocused ? 'ring-2 ring-yellow-400' : ''}`}
            animate={{ width: searchFocused ? 300 : 200 }}
            transition={{ duration: 0.3 }}
          >
            <SearchIcon className="text-gray-400 mr-2" />
            <InputBase
              placeholder="Search..."
              className="text-white w-full"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </motion.div>
  
          {/* Admin Section */}
          <div className="flex items-center">
            <IconButton color="inherit">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon sx={{color:'#FACC15'}} />
              </Badge>
            </IconButton>
            <span className="mx-2 text-yellow-400">Admin</span>
            <Avatar className="mr-2">A</Avatar>
            <IconButton color="inherit">
              <ExitToAppIcon sx={{color:'#FACC15'}}/>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    );
}

export default AdminNavbar
