import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box, Button } from '@mui/material';
import Cookies from 'js-cookie'
import api from '../Api/api'

const ProfileDescription = ({ user, days }) => {
    const [following, setFollowing] = useState(false);
    const [follower, setFollower] = useState();
    const navigate = useNavigate();
    let currentUser = Cookies.get('username');
    let admin = Cookies.get('admin');

    const theme = createTheme ({
        typography: {
            button: {
                textTransform: 'none',
            }
        },

        palette: {
            gold: {
                main: '#E0A96D',
                contrastText: '#fff',
            },
            black: {
                main: '#000000',
                contrastText: '#fff',
            },
            pink: {
                main: '#FA9285',
                contrastText: '#fff',
            },
            yellow: {
                main: '#F2DB36'
            }
        }
    }); 

    useEffect(() => {
        const fetchFollowship = async() => {
            const data = await api.followshipGet(user.username);
            
            if (data.errorCode === 404 || data.errorCode === 403) {
                setFollowing(false);
            } else {
                setFollowing(true);
            }
        }

        const fetchFollowerCount = async() => {
            const data = await api.followshipGetCountByUser(user.username);

            if (data.errorCode === 0) {
                setFollower(data.count);
            }
        }

        if (user.username !== currentUser) {
            fetchFollowship();
        }

        fetchFollowerCount();
    }, [user, currentUser, following])

    const handleFollowship = async() => {
        if (following) {
            // delete followship
            const data = await api.followshipDelete(user.id);

            if (data.errorCode === 0) {
                setFollowing(false)
            }
        } else {
            // create followship
            const data = await api.followshipCreate(user.id);
            
            if (data.errorCode === 0) {
                setFollowing(true)
            }
        }
    }

    const unbanUser = async() => {
        await api.userUnban(user.id);
        window.location.reload()
    }

    const banUser = async() => {
        await api.userBan(user.id);
        window.location.reload()
    }

    const linkReport = () => {
        navigate(`/report/create/user/${user.id}`)
    }

    return (
        <Box>
            <Box display='flex' justifyContent='center'>
                <Box fontSize={18} mt={5} color='darkgrey'>
                    #{user.id}
                </Box>
            </Box>

            <Box fontSize={20} fontWeight='bold' mt={2}>
                {user.username}
            </Box>

            <Box fontSize={18} mt={3} color='darkgrey'>
                已注册 {days} 天
            </Box>

            <Box fontSize={18} mt={5}>
                已有 {follower} 人关注
            </Box>

            <Box display='flex' justifyContent='center' mt={4}>
                <Box>
                    { (user.username === currentUser) || admin || user.status === 0 ? 
                        <ThemeProvider theme={theme}>
                            <Button disabled variant="contained" size="small" style={{ borderRadius: 13, width: 100, height: 35 }}> 
                                <Box sx={{fontSize: 18, minWidth: '50px', fontWeight: 'bold'}}>关注</Box>
                            </Button>
                        </ThemeProvider> :
                        <Box>
                            { following ? 
                                <ThemeProvider theme={theme}>
                                    <Button onClick={handleFollowship} variant="contained" size="small" color='black' style={{ borderRadius: 13, width: 100, height: 35 }}> 
                                        <Box sx={{fontSize: 18, minWidth: '50px', fontWeight: 'bold'}}>取关</Box>
                                    </Button>
                                </ThemeProvider> :
                                <ThemeProvider theme={theme}>
                                    <Button onClick={handleFollowship} variant="contained" size="small" color='gold' style={{ borderRadius: 13, width: 100, height: 35 }}> 
                                        <Box sx={{fontSize: 18, minWidth: '50px', fontWeight: 'bold'}}>关注</Box>
                                    </Button>
                                </ThemeProvider>
                            }
                        </Box>
                    }
                    
                </Box>
                
                <Box ml={3}>
                    { admin ? 
                        user.status === 0 ? 
                            <ThemeProvider theme={theme}>
                                <Button onClick={unbanUser} variant="contained" size="small" color='black' style={{ borderRadius: 13, width: 100, height: 35 }}> 
                                    <Box sx={{fontSize: 18, minWidth: '50px', fontWeight: 'bold'}}>解封</Box>
                                </Button>
                            </ThemeProvider> :
                            <ThemeProvider theme={theme}>
                                <Button onClick={banUser} variant="contained" size="small" color='pink' style={{ borderRadius: 13, width: 100, height: 35 }}> 
                                    <Box sx={{fontSize: 18, minWidth: '50px', fontWeight: 'bold'}}>封锁</Box>
                                </Button>
                            </ThemeProvider>
                        : (user.username === currentUser) || user.status === 0 ? 
                            <ThemeProvider theme={theme}>
                                <Button disabled onClick={linkReport} variant="contained" size="small" color='pink' style={{ borderRadius: 13, width: 100, height: 35 }}> 
                                    <Box sx={{fontSize: 18, minWidth: '50px', fontWeight: 'bold'}}>举报</Box>
                                </Button>
                            </ThemeProvider> :
                            <ThemeProvider theme={theme}>
                                <Button onClick={linkReport} variant="contained" size="small" color='pink' style={{ borderRadius: 13, width: 100, height: 35 }}> 
                                    <Box sx={{fontSize: 18, minWidth: '50px', fontWeight: 'bold'}}>举报</Box>
                                </Button>
                            </ThemeProvider>
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default ProfileDescription