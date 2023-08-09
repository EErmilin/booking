import { SELECT_RESERVATION } from "../actions/actionsType";


const initialValues = {
    currentClientReservations:
    {
        id: 4,
        title: "Отель Вега Измайлово",
        rating: 4,
        description: "Двухместный номер с 1 кроватью или 2 отдельными кроватями",
        guest: "2 ночи, 2 взрослых",
        address: "Москва, Ул. Красносельская 35",
        price: 47658,
        commentRating: 9.2,
        commentCount: 516,
        privilege: [
            "accessible", "music", "parking", "pool", "car", "wifi"
        ],
        status: "approved",
        cause: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer diam ipsum cursus tempus ut. Dolor, Mi et fusce at mattis ultricies turpis maecenas. Sed etiam facilisis vel ut. Aliquet aenean amet, gravida in adipiscing et velit diam.fringilla iaculis ultricies justo adipiscing id fringilla. Sem consectetur tincidunt tempus congue sagittis lobortis nec sit. Mi et fusce at mattis ultricies turpis maecenas. Sed etiam facilisis vel ut. Aliquet aenean amet, gravida in adipiscing et velit diam.",
    },
    clientReservations: [
        {
            id: 4,
            title: "Отель Вега Измайлово",
            rating: 4,
            description: "Двухместный номер с 1 кроватью или 2 отдельными кроватями",
            guest: "2 ночи, 2 взрослых",
            address: "Москва, Измайловское шоссе, д. 71, стр. 3В",
            price: 47658,
            commentRating: 9.2,
            commentCount: 516,
            status: "approved",
            date: '16.06.22 — 18.06.22',
            namber: '895289'
        },
        {
            id: 4,
            title: "Отель Вега Измайлово",
            rating: 4,
            description: "Двухместный номер с 1 кроватью или 2 отдельными кроватями",
            guest: "2 ночи, 2 взрослых",
            address: "Москва, Измайловское шоссе, д. 71, стр. 3В",
            price: 47658,
            commentRating: 9.2,
            commentCount: 516,
            status: "waiting",
            date: '16.06.22 — 18.06.22',
            namber: '895289'
        },
        {
            id: 4,
            title: "Отель Вега Измайлово",
            rating: 4,
            description: "Двухместный номер с 1 кроватью или 2 отдельными кроватями",
            guest: "2 ночи, 2 взрослых",
            address: "Москва, Измайловское шоссе, д. 71, стр. 3В",
            price: 47658,
            commentRating: 9.2,
            commentCount: 516,
            status: "completed",
            date: '16.06.22 — 18.06.22',
            namber: '895289'
        },
        {
            id: 4,
            title: "Отель Вега Измайлово",
            rating: 4,
            description: "Двухместный номер с 1 кроватью или 2 отдельными кроватями",
            guest: "2 ночи, 2 взрослых",
            address: "Москва, Измайловское шоссе, д. 71, стр. 3В",
            price: 47658,
            commentRating: 9.2,
            commentCount: 516,
            status: "canceled",
            date: '16.06.22 — 18.06.22',
            namber: '895289'
        },
        {
            id: 4,
            title: "Отель Вега Измайлово",
            rating: 4,
            description: "Двухместный номер с 1 кроватью или 2 отдельными кроватями",
            guest: "2 ночи, 2 взрослых",
            address: "Москва, Измайловское шоссе, д. 71, стр. 3В",
            price: 47658,
            commentRating: 9.2,
            commentCount: 516,
            status: "canceledHotel",
            date: '16.06.22 — 18.06.22',
            namber: '895289'
        },
    ],
    reservations: [
        {
            hotel: 'Garden hotel',
            reservations: '10',
            availableRooms: '5',
            request: '5',
            currentReservations: [
                {
                    type: 'Двухместный номер с 2 отдельными кроватями',
                    checkIn: 'Чт, 16.06.22',
                    leaving: 'Сб, 18.06.22',
                    guestsCount: '2 взр. 2 дет.',
                    status: 'approved',
                    number: 434802,
                    price: '8 460 руб.',
                    nights: 2,
                    additionalInfo: {
                        services: 'Требуется трансфер',
                        arrival: '13:00 — 14:00 ',
                        comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer diam ipsum cursus tempus ut. Dolor, fringilla iaculis ultricies justo adipiscing id fringilla. Sem consectetur tincidunt tempus congue sagittis lobortis nec sit. Mi et fusce at mattis ultricies turpis maecenas. Sed etiam facilisis vel ut. Aliquet aenean amet, gravida in adipiscing et velit diam. Amet scelerisque integer quis elementum risus viverra etiam. Vel nulla tristique tortor ipsum ligula. Sed nisl aliquam porta massa at nisi, eu hac aliquet. Mattis dictumst vitae lectus cursus sodales ut. Ut tellus nullam et suscipit viverra adipiscing quis quis pulvinar. Duis suspendisse laoreet enim ultricies'
                    },
                    guests: [
                        {
                            name: 'Ольга Шмидт',
                            email: 'MBmail@mail.com',
                            phone: '+7 (920) 000-00-00',
                        },
                        {
                            name: 'Михаил Бурунов',
                            email: 'mail@mail.com',
                        }],
                },
                {
                    type: 'Двухместный номер с 2 отдельными кроватями',
                    checkIn: 'Чт, 16.06.22',
                    leaving: 'Сб, 18.06.22',
                    guestsCount: '2 взр. 2 дет.',
                    status: 'canceledHotel',
                    number: 434802,
                    price: '8 460 руб.',
                    nights: 2,
                    additionalInfo: {
                        services: 'Требуется трансфер',
                        arrival: '13:00 — 14:00 ',
                        comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer diam ipsum cursus tempus ut. Dolor, fringilla iaculis ultricies justo adipiscing id fringilla. Sem consectetur tincidunt tempus congue sagittis lobortis nec sit. Mi et fusce at mattis ultricies turpis maecenas. Sed etiam facilisis vel ut. Aliquet aenean amet, gravida in adipiscing et velit diam. Amet scelerisque integer quis elementum risus viverra etiam. Vel nulla tristique tortor ipsum ligula. Sed nisl aliquam porta massa at nisi, eu hac aliquet. Mattis dictumst vitae lectus cursus sodales ut. Ut tellus nullam et suscipit viverra adipiscing quis quis pulvinar. Duis suspendisse laoreet enim ultricies'
                    },
                    guests: [
                        {
                            name: 'Ольга Шмидт',
                            email: 'MBmail@mail.com',
                            phone: '+7 (920) 000-00-00',
                        },
                        {
                            name: 'Михаил Бурунов',
                            email: 'mail@mail.com',
                        }],
                }
            ],
        },
    ]
}

export function reservationsReducer(state = initialValues, action) {
    switch (action.type) {
        case SELECT_RESERVATION:
            return { ...state, currentReservation: action.reservation }

        default: return state
    }
}