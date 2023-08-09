const initialValues = {
    requests: [
        {
            title: 'При регистрации объекта выдает ошибку',
            status: 'requestClosed',
            messages: {
                message: [{
                    login: 'Вы',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer diam ipsum cursus tempus ut. Dolor, fringilla iaculis ultricies justo adipiscing id fringilla. Sem consectetur tincidunt tempus congue sagittis lobortis nec sit. Mi et fusce at mattis ultricies turpis maecenas. Sed etiam facilisis vel ut. Aliquet aenean amet, gravida in adipiscing et velit diam. Amet scelerisque integer quis elementum risus viverra etiam. Vel nulla tristique tortor ipsum ligula. Sed nisl aliquam porta massa at nisi, eu hac aliquet. Mattis dictumst vitae lectus cursus sodales ut. ',
                    isSupport: false,
                    date: 'Вчера'
                },
                {
                    login: 'Кристина Юдева',
                    email: 'email@email.com',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer diam ipsum cursus tempus ut. Dolor, fringilla iaculis ultricies justo adipiscing id fringilla. Sem consectetur tincidunt tempus congue sagittis lobortis nec sit.',
                    isSupport: true,
                    date: 'Сегодня'
                },
                {
                    login: 'Вы',
                    text: 'Спасибо за помощь!',
                    isSupport: false,
                    date: 'Сегодня'
                },
                {
                    login: 'Кристина Юдева',
                    text: 'Всегда рады помочь!',
                    isSupport: true,
                    date: 'Сегодня'
                },
                ]
            },

        },
        {
            title: 'При регистрации объекта выдает ошибку',
            status: 'requestInWork',
            messages: {
                message: [{
                    login: 'Вы',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer diam ipsum cursus tempus ut. Dolor, fringilla iaculis ultricies justo adipiscing id fringilla. Sem consectetur tincidunt tempus congue sagittis lobortis nec sit. Mi et fusce at mattis ultricies turpis maecenas. Sed etiam facilisis vel ut. Aliquet aenean amet, gravida in adipiscing et velit diam. Amet scelerisque integer quis elementum risus viverra etiam. Vel nulla tristique tortor ipsum ligula. Sed nisl aliquam porta massa at nisi, eu hac aliquet. Mattis dictumst vitae lectus cursus sodales ut. ',
                    isSupport: false,
                    date: 'Вчера'
                },
                {
                    login: 'Кристина Юдева',
                    email: 'email@email.com',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer diam ipsum cursus tempus ut. Dolor, fringilla iaculis ultricies justo adipiscing id fringilla. Sem consectetur tincidunt tempus congue sagittis lobortis nec sit.',
                    isSupport: true,
                    date: 'Сегодня'
                },
                {
                    login: 'Вы',
                    text: 'Спасибо за помощь!',
                    isSupport: false,
                    date: 'Сегодня'
                },
                {
                    login: 'Кристина Юдева',
                    text: 'Всегда рады помочь!',
                    isSupport: true,
                    date: 'Сегодня'
                },
                ]
            },

        },
        {
            title: 'При регистрации объекта выдает ошибку',
            status: 'requestOnReview',
            messages: {
                message: [{
                    login: 'Вы',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer diam ipsum cursus tempus ut. Dolor, fringilla iaculis ultricies justo adipiscing id fringilla. Sem consectetur tincidunt tempus congue sagittis lobortis nec sit. Mi et fusce at mattis ultricies turpis maecenas. Sed etiam facilisis vel ut. Aliquet aenean amet, gravida in adipiscing et velit diam. Amet scelerisque integer quis elementum risus viverra etiam. Vel nulla tristique tortor ipsum ligula. Sed nisl aliquam porta massa at nisi, eu hac aliquet. Mattis dictumst vitae lectus cursus sodales ut. ',
                    isSupport: false,
                    date: 'Вчера'
                },
                {
                    login: 'Кристина Юдева',
                    email: 'email@email.com',
                    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer diam ipsum cursus tempus ut. Dolor, fringilla iaculis ultricies justo adipiscing id fringilla. Sem consectetur tincidunt tempus congue sagittis lobortis nec sit.',
                    isSupport: true,
                    date: 'Сегодня'
                },
                {
                    login: 'Вы',
                    text: 'Спасибо за помощь!',
                    isSupport: false,
                    date: 'Сегодня'
                },
                {
                    login: 'Кристина Юдева',
                    text: 'Всегда рады помочь!',
                    isSupport: true,
                    date: 'Сегодня'
                },
                ]
            },

        }
    ]

}

export function supportReducer(state = initialValues, action) {
    switch (action.type) {
        default: return state
    }
}