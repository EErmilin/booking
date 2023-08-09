import Main from "../pages/NotAuth/Main/Main";
import Catalog from "../pages/NotAuth/Catalog/Catalog";
import HotelCard from "../pages/NotAuth/HotelCard/HotelCard";
import HotelRoom from "../pages/NotAuth/HotelRoom/HotelRoom";
import Auth from "../pages/NotAuth/Auth/Auth";
import Login from "../pages/NotAuth/Auth/Login/Login";
import Register from "../pages/NotAuth/Auth/Register/Register";
import PersonalArea from "../pages/Auth/PersonalArea/PersonalArea";
import Profile from "../pages/Auth/PersonalArea/Profile/Profile";
import Objects from "../pages/Auth/PersonalArea/Objects/Objects";
import AddNewObject from "../pages/Auth/PersonalArea/AddNewObject/AddNewObject";
import FirstStep from "../pages/Auth/PersonalArea/AddNewObject/FirstStep/FirstStep";
import SecondStep from "../pages/Auth/PersonalArea/AddNewObject/SecondStep/SecondStep";
import ThirdStep from "../pages/Auth/PersonalArea/AddNewObject/ThirdStep/ThirdStep";
import ForthStep from "../pages/Auth/PersonalArea/AddNewObject/ForthStep/ForthStep";
import FifthStep from "../pages/Auth/PersonalArea/AddNewObject/FifthStep/FifthStep";
import SixthStep from "../pages/Auth/PersonalArea/AddNewObject/SixthStep/SixthStep";
import AddNewRoom from "../pages/Auth/PersonalArea/AddNewObject/ThirdStep/AddNewRoom/AddNewRoom";
import ListObjects from "../pages/Auth/PersonalArea/Objects/ListObjects/ListObjects";
import ListRequisites from "../pages/Auth/PersonalArea/Requisites/ListRequisites/ListRequisites";
import Rooms from "../pages/Auth/PersonalArea/Objects/Hotel/Rooms";
import About from "../pages/NotAuth/About/About";
import Contact from "../pages/NotAuth/Contact/Contact";
import Terms from "../pages/NotAuth/Terms/Terms";
import Reservations from "../pages/Auth/PersonalArea/Reservations/Reservations";
import CurrentHotel from "../pages/Auth/PersonalArea/Reservations/Partner/Pages/CurrentHotel/CurrentHotel";
import ListReservations from "../pages/Auth/PersonalArea/Reservations/ListReservations";
import SupportAndModeration from "../pages/Auth/PersonalArea/Support/SupportAndModeration";
import HotelModeration from "../pages/Auth/PersonalArea/Support/HotelModeration/HotelModeration";
import SupportAndModerationRoute from "../pages/Auth/PersonalArea/Support/SupportAndModerationRoute";
import SupportClient from "../pages/Auth/PersonalArea/Support/Support/SupportClient";

import Notifications from "../pages/Auth/PersonalArea/Notifications/Notifications";
import Booking from "../pages/Auth/Booking/Booking";
import ReservationClientItem from "../pages/Auth/PersonalArea/Reservations/Client/Pages/CurrentReservationClient/ReservationClientItem";
import { CLIENT_ROLE, PARTNER_ROLE } from "../roles/roles";
import PageNotFound from "../pages/NotAuth/Page404/Page404";
import RegisterClient from "../pages/NotAuth/Auth/RegisterClient/RegisterClient";
import LoginClient from "../pages/NotAuth/Auth/LoginClient/LoginClient";
import Comment from "../pages/Auth/PersonalArea/Comment/Comment";
import Support from "../pages/Auth/PersonalArea/Support/Support/Support";
import BlogMain from "../pages/NotAuth/Blog/BlogMain/BlogMain";
import Article from "../pages/NotAuth/Blog/Article/Article";
import Rules from "../pages/NotAuth/Rules/Rules";
import BestDirectionsPage from "../pages/NotAuth/BestDirectionsPage/BestDirectionsPage";
import Partner from "../pages/NotAuth/Partner/Partner";
import Favorites from "../pages/Auth/PersonalArea/Favorites/Favorites";
import CommentClient from "../pages/Auth/PersonalArea/CommentClient/CommentClient";
import Channels from "../pages/Auth/PersonalArea/Channels/Channels";
import Prices from "../pages/Auth/PersonalArea/Prices/Prices";
import ListHotels from "../pages/Auth/PersonalArea/Prices/ListHotels/ListHotels";
import Hotel from "../pages/Auth/PersonalArea/Reservations/Partner/components/Hotel/Hotel";
import HotelPrice from "../pages/Auth/PersonalArea/Prices/hotel/HotelPrice";
import Policy from "../pages/NotAuth/Policy/Policy";
import UserTermOfUse from "../pages/NotAuth/UserTermOfUse/UserTermOfUse";
import Offer from "../pages/NotAuth/Offer/Offer";
import Cookies from "../pages/NotAuth/Cookies/Cookies";
import RegisterEasy from "../pages/NotAuth/Auth/Register/RegisterEasy";
import ServiceRules from "../pages/NotAuth/ServiceRules/ServiceRules"
import PlatformRules from "../pages/NotAuth/PlatformRules/PlatformRules"
import Requisite from "../pages/NotAuth/Requisite/Requisite";
import RegisterByToken from "../pages/NotAuth/Auth/Register/RegisterByToken/RegisterByToken";
import TablePrice from "../pages/Auth/PersonalArea/TablePrice/TablePrice";
import Achievements from "../pages/Auth/PersonalArea/Achievements/Achievements";
import ListReports from "../pages/Auth/PersonalArea/Reports/ListReports";
import Reports from "../pages/Auth/PersonalArea/Reports/Reports";
import Report from "../pages/Auth/PersonalArea/Reports/Report/Report";
import HotelRequisites from "../pages/Auth/PersonalArea/Requisites/HotelRequisites/HotelRequisites";
import ListArchive from "../pages/Auth/PersonalArea/ArchiveObjects/ListArchive";
import RequisitesRoutes from "../pages/Auth/PersonalArea/Requisites/RequisitesRoutes";
import Payments from "../pages/NotAuth/Payments/Payments";
import TermsResearch from "../pages/NotAuth/TermsResearch/TermsResearch";
import PromoRules from "../pages/NotAuth/PromoRules/PromoRules"
import RecoveryPartnerPassword from "../pages/NotAuth/Auth/RecoveryPartnerPassword/RecoveryPartnerPassword";

export const routes = [
    {
        name: 'main',
        privateUrl: false,
        component: <Main />,
        path: '/',
        exact: true,
        headerType: 1,
        footerType: 1,
    },
    {
        name: 'catalog',
        privateUrl: false,
        component: <Catalog />,
        path: 'catalog/:page',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'hotelCard',
        privateUrl: false,
        component: <HotelCard />,
        path: 'hotel',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'hotelRoom',
        privateUrl: false,
        component: <HotelRoom />,
        path: 'hotel/room',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'blog',
        privateUrl: false,
        component: <BlogMain />,
        path: 'blog/:page',
        exact: false,
        headerType: 1,
        footerType: 1,
    },
    {
        name: 'blog',
        privateUrl: false,
        component: <BlogMain />,
        path: 'blog/',
        exact: false,
        headerType: 1,
        footerType: 1,
    },

    {
        name: 'my-reservations',
        privateUrl: false,
        component: <ReservationClientItem />,
        path: 'booking',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'faq',
        privateUrl: false,
        component: <Requisite />,
        path: 'requisite',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'article',
        privateUrl: false,
        component: <Article />,
        path: 'blog/article',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'partner',
        privateUrl: false,
        component: <Partner />,
        path: 'partner',
        exact: false,
        headerType: 1,
    },
    {
        name: 'personal-area',
        privateUrl: true,
        component: <PersonalArea
            routes={
                [
                    {
                        name: 'profile',
                        privateUrl: true,
                        component: <Profile />,
                        path: 'profile',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'reports',
                        privateUrl: true,
                        roles: [PARTNER_ROLE],
                        component: <Reports
                            routes={[
                                {
                                    name: 'list-reports',
                                    privateUrl: true,
                                    component: <ListReports />,
                                    path: '',
                                    exact: false,
                                    headerType: 2,
                                    footerType: 2,
                                },
                                {
                                    name: 'report',
                                    privateUrl: true,
                                    component: <Report />,
                                    path: '/:id',
                                    exact: false,
                                    headerType: 2,
                                    footerType: 2,
                                },
                            ]}
                        />,
                        path: 'reports/*',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    // {
                    //     name: 'achievements',
                    //     privateUrl: true,
                    //     roles: [CLIENT_ROLE],
                    //     component: <Achievements />,
                    //     path: 'achievements',
                    //     exact: false,
                    //     headerType: 2,
                    //     footerType: 2,
                    // },
                    {
                        name: 'objects',
                        privateUrl: true,
                        roles: [PARTNER_ROLE],
                        component: <Objects
                            routes={[
                                {
                                    name: 'list-object',
                                    privateUrl: true,
                                    component: <ListObjects />,
                                    path: ':page',
                                    exact: false,
                                    headerType: 2,
                                    footerType: 2,
                                },
                                {
                                    name: 'rooms',
                                    privateUrl: true,
                                    component: <Rooms />,
                                    path: 'rooms/:id',
                                    exact: false,
                                    headerType: 2,
                                    footerType: 2,
                                },
                            ]}
                        />,
                        path: 'objects/*',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'archive',
                        privateUrl: true,
                        component: <ListArchive />,
                        path: 'archive/:page',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'requisites',
                        privateUrl: true,
                        roles: [PARTNER_ROLE],
                        component: <RequisitesRoutes
                            routes={[
                                {
                                    name: 'list-object',
                                    privateUrl: true,
                                    component: <ListRequisites />,
                                    path: ':page',
                                    exact: false,
                                    headerType: 2,
                                    footerType: 2,
                                },
                                {
                                    name: 'hotel',
                                    privateUrl: true,
                                    component: <HotelRequisites />,
                                    path: 'hotel/:id',
                                    exact: false,
                                    headerType: 2,
                                    footerType: 2,
                                },
                            ]}
                        />,
                        path: 'requisites/*',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'reservations',
                        roles: [PARTNER_ROLE],
                        privateUrl: true,
                        component: <Reservations
                            routes={[
                                {
                                    name: 'hotel',
                                    privateUrl: true,
                                    component: <CurrentHotel />,
                                    path: 'hotel/:hotelId/:page',
                                    exact: false,
                                    headerType: 2,
                                    footerType: 2,
                                },
                                {
                                    name: 'list-reservations',
                                    privateUrl: true,
                                    component: <ListReservations />,
                                    path: '',
                                    exact: false,
                                    headerType: 2,
                                    footerType: 2,
                                },
                                {
                                    name: 'reservation',
                                    privateUrl: true,
                                    component: <ReservationClientItem />,
                                    path: 'reservation',
                                    exact: false,
                                    headerType: 2,
                                    footerType: 2,
                                },
                            ]}
                        />,
                        path: 'reservations/*',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'my-reservations',
                        privateUrl: true,
                        component: <Reservations
                            routes={[
                                {
                                    name: 'list-reservations',
                                    privateUrl: true,
                                    component: <ListReservations />,
                                    path: ':page',
                                    exact: false,
                                    headerType: 2,
                                    footerType: 2,
                                },
                                {
                                    name: 'reservation',
                                    privateUrl: true,
                                    component: <ReservationClientItem />,
                                    path: 'reservation/:id',
                                    exact: false,
                                    headerType: 2,
                                    footerType: 2,
                                },
                            ]}
                        />,
                        path: 'my-reservations/*',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'support',
                        privateUrl: true,
                        roles: [PARTNER_ROLE],
                        component: <SupportAndModerationRoute routes={[
                            {
                                name: 'list-moderation',
                                privateUrl: false,
                                component: <SupportAndModeration />,
                                path: ':page',
                                exact: true,
                                headerType: 2,
                                footerType: 2,
                            }, {
                                name: 'hotel-moderation',
                                privateUrl: true,
                                component: <HotelModeration />,
                                path: 'hotel/:id',
                                exact: false,
                                headerType: 2,
                                footerType: 2,
                            },
                        ]} />,
                        path: 'support/*',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'channels',
                        privateUrl: true,
                        roles: [PARTNER_ROLE],
                        component: <Channels />,
                        path: 'channels',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'support',
                        privateUrl: true,
                        roles: [CLIENT_ROLE],
                        component: <SupportClient />,
                        path: 'support-client/:page',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'favorites',
                        privateUrl: true,
                        roles: [CLIENT_ROLE],
                        component: <Favorites />,
                        path: 'favorites/',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'comments',
                        privateUrl: false,
                        roles: [PARTNER_ROLE],
                        component: <Comment />,
                        path: 'comments',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'comments',
                        privateUrl: false,
                        roles: [CLIENT_ROLE],
                        component: <CommentClient />,
                        path: 'comments',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'prices',
                        privateUrl: false,
                        roles: [PARTNER_ROLE],
                        component: <Prices routes={[
                            {
                                name: 'list-hotels',
                                privateUrl: true,
                                roles: [PARTNER_ROLE],
                                component: <ListHotels />,
                                path: ':page',
                                exact: false,
                                headerType: 2,
                                footerType: 2,
                            },
                            {
                                name: 'hotel',
                                privateUrl: true,
                                roles: [PARTNER_ROLE],
                                component: <HotelPrice />,
                                path: 'hotel/:id',
                                exact: false,
                                headerType: 2,
                                footerType: 2,
                            },
                        ]} />,
                        path: 'prices/*',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'notifications',
                        privateUrl: false,
                        roles: [PARTNER_ROLE],
                        component: <Notifications userType={"partner"} />,
                        path: 'notifications',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'notifications',
                        privateUrl: false,
                        roles: [CLIENT_ROLE],
                        component: <Notifications userType={"client"} />,
                        path: 'notifications',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                ]
            }
        />,
        path: 'personal-area/*',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    // {
    //     name: 'table-price',
    //     privateUrl: true,
    //     roles: [PARTNER_ROLE],
    //     component: <TablePrice />,
    //     path: 'table-price/:hotelId',
    //     exact: false,
    //     headerType: 2,
    //     footerType: 2,
    // },
    {
        name: 'add-object',
        privateUrl: true,
        roles: [PARTNER_ROLE],
        component: <AddNewObject
            routes={
                [
                    {
                        name: 'first-step',
                        privateUrl: true,
                        component: <FirstStep />,
                        path: '',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'second-step',
                        privateUrl: true,
                        component: <SecondStep />,
                        path: '/:id/second-step',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'third-step',
                        privateUrl: true,
                        component: <ThirdStep routes={[
                            {
                                name: 'add-room',
                                privateUrl: true,
                                component: <AddNewRoom />,
                                path: 'add-room',
                                exact: false,
                                headerType: 2,
                                footerType: 2,
                            },
                            {
                                name: 'edit-room',
                                privateUrl: true,
                                component: <AddNewRoom  edit={true}/>,
                                path: 'edit-room/:roomId',
                                exact: false,
                                headerType: 2,
                                footerType: 2,
                            }
                        ]} />,
                        path: '/:id/third-step/*',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'forth-step',
                        privateUrl: true,
                        component: <ForthStep />,
                        path: ':id/fourth-step',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'fifth-step',
                        privateUrl: true,
                        component: <FifthStep />,
                        path: ':id/fifth-step',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'sixth-step',
                        privateUrl: true,
                        component: <SixthStep />,
                        path: ':id/sixth-step',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                ]
            }
        />,
        path: 'add-object/*',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'edit-object',
        privateUrl: true,
        roles: [PARTNER_ROLE],
        component: <AddNewObject
            edit={true}
            routes={
                [
                    {
                        name: 'first-step',
                        privateUrl: true,
                        component: <FirstStep edit={true} />,
                        path: ':id/first-step',
                        edit: true,
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'second-step',
                        privateUrl: true,
                        component: <SecondStep edit={true}/>,
                        path: '/:id/second-step',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'third-step',
                        privateUrl: true,
                        component: <ThirdStep edit={true} routes={[
                            {
                                name: 'add-room',
                                privateUrl: true,
                                component: <AddNewRoom edit={true} />,
                                path: 'add-room',
                                exact: false,
                                headerType: 2,
                                footerType: 2,
                            },
                            {
                                name: 'edit-room',
                                privateUrl: true,
                                component: <AddNewRoom edit={true} editHotel={true} />,
                                path: 'edit-room/:roomId',
                                exact: false,
                                headerType: 2,
                                footerType: 2,
                            }
                        ]} />,
                        path: '/:id/third-step/*',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'forth-step',
                        privateUrl: true,
                        component: <ForthStep edit={true} />,
                        path: ':id/fourth-step',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'fifth-step',
                        privateUrl: true,
                        component: <FifthStep edit={true} />,
                        path: ':id/fifth-step',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'sixth-step',
                        privateUrl: true,
                        component: <SixthStep edit={true} />,
                        path: ':id/sixth-step',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                ]
            }
        />,
        path: 'edit-object/*',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'about',
        privateUrl: false,
        roles: [PARTNER_ROLE],
        component: <About />,
        path: 'about',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'auth',
        privateUrl: false,
        component: <Auth
            routes={
                [
                    {
                        name: 'login',
                        privateUrl: false,
                        component: <Login />,
                        path: 'partner/login',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'simpleregister',
                        privateUrl: false,
                        component: <RegisterEasy />,
                        path: 'partner/simpleregister',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'simpleregister',
                        privateUrl: false,
                        component: <RegisterByToken />,
                        path: 'partner/simpleregister/:hotelId/:token',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'register',
                        privateUrl: false,
                        component: <Register />,
                        path: 'partner/register',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'login-client',
                        privateUrl: false,
                        component: <LoginClient />,
                        path: 'login',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    },
                    {
                        name: 'register-client',
                        privateUrl: false,
                        component: <RegisterClient />,
                        path: 'register',
                        exact: false,
                        headerType: 2,
                        footerType: 2,
                    }
                ]
            }
        />,
        path: 'auth/*',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'about',
        privateUrl: false,
        component: <About />,
        path: 'about',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'booking',
        component: <Booking />,
        path: 'booking/:hotelId/:roomId',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'contact',
        privateUrl: false,
        component: <Contact />,
        path: 'contact',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'BestDirectionsPage',
        privateUrl: false,
        component: <BestDirectionsPage />,
        path: 'directions',
        exact: false,
        headerType: 1,
        footerType: 1,
    },
    {
        name: 'terms',
        privateUrl: false,
        component: <Terms />,
        path: 'terms',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'policy',
        privateUrl: false,
        component: <Policy />,
        path: 'policy',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'user-term-of-use',
        privateUrl: false,
        component: <UserTermOfUse />,
        path: 'user-term-of-use',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'offer',
        privateUrl: false,
        component: <Offer />,
        path: 'offer',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'rules',
        privateUrl: false,
        component: <Rules />,
        path: 'rules',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'cookies',
        privateUrl: false,
        component: <Cookies />,
        path: 'cookies',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'serviceRules',
        privateUrl: false,
        component: <ServiceRules />,
        path: 'service-rules',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'platformRules',
        privateUrl: false,
        component: <PlatformRules />,
        path: 'platform-rules',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'pageNotFound',
        privateUrl: false,
        component: <PageNotFound />,
        path: '*',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'table-price',
        privateUrl: true,
        roles: [PARTNER_ROLE],
        component: <TablePrice />,
        path: 'table-price/:hotelId',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'payments',
        privateUrl: false,
        component: <Payments />,
        path: 'payments',
        exact: false,
        headerType: 2,
        footerType: 2,
    },

    {
        name: 'promoRules',
        privateUrl: false,
        component: <PromoRules />,
        path: 'promo-rules',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'terms-research',
        privateUrl: false,
        component: <TermsResearch />,
        path: 'terms_research',
        exact: false,
        headerType: 2,
        footerType: 2,
    },
    {
        name: 'recovery-password-partner',
        privateUrl: false,
        component: <RecoveryPartnerPassword />,
        path: 'recovery',
        exact: false,
        headerType: 2,
        footerType: 2,
    },

]