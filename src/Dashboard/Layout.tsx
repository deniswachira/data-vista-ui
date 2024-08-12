
import { Outlet } from 'react-router-dom'
import SideNav from './SideNav'
import Card from './Card'

function Layout() {
    return (
        <div className='flex max-h-fit min-h-full  text-green-400'>
            <div className='min-w-[17%]  '>
                <SideNav />
            </div>
            <div className='flex flex-col min-w-[83%] '>
                {/* <Nav /> */}
                <div className="h-fit">
                    <Card>
                        <Outlet />
                    </Card>
                </div>

            </div>
        </div>
    )
}

export default Layout