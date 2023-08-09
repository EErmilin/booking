export const getAmenitie = (id) => {
    const yslugi =[
      {
        "id": 206,
        "name": "DVD-плеер",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 168,
        "name": "VIP-удобства в номере",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 400,
        "name": "Wi-Fi",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 416,
        "name": "Барбекю",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 248,
        "name": "Будильник",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 420,
        "name": "Ванна",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 223,
        "name": "Ванна",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 399,
        "name": "Вентилятор",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 406,
        "name": "Внутренний дворик",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 402,
        "name": "Вода",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 427,
        "name": "Высокоскоростной интернет",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 398,
        "name": "Гардероб",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 413,
        "name": "Гипоаллергенная",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 188,
        "name": "Детектор дыма",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 415,
        "name": "Домашние животные разрешены",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 395,
        "name": "Дополнительный сервис",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 382,
        "name": "Душ",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 224,
        "name": "Душ",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 222,
        "name": "Душ/Ванна",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 212,
        "name": "Запирающийся шкафчик",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 417,
        "name": "Затемняющие жалюзи",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 410,
        "name": "Звукоизоляция",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 409,
        "name": "Зеркало",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 193,
        "name": "Кабельное телевидение",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 422,
        "name": "Камин",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 185,
        "name": "Камин",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 418,
        "name": "Кондиционер",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 391,
        "name": "Кофе",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 412,
        "name": "Кухня",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 407,
        "name": "Кухонные принадлежности",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 27,
        "name": "Люкс для новобрачных",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 380,
        "name": "Микроволновка",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 204,
        "name": "Мини-бар",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 387,
        "name": "Мини-бар",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 286,
        "name": "Мини-холодильник",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 384,
        "name": "Москитная сетка",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 252,
        "name": "Москитная сетка",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 198,
        "name": "Музыкальный центр",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 29,
        "name": "Номера для аллергиков",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 147,
        "name": "Номера для курящих",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 30,
        "name": "Номера для некурящих",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 31,
        "name": "Номера со звукоизоляцией",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 386,
        "name": "Обеденный стол",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 419,
        "name": "Обогрев",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 33,
        "name": "Обслуживание номеров",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 408,
        "name": "Общая ванная комната",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 390,
        "name": "Отдельная ванная комната",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 394,
        "name": "Отдельная ванная комната снаружи",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 388,
        "name": "Отдельный вход",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 383,
        "name": "Подушки",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 392,
        "name": "Полотенца",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 246,
        "name": "Постельное белье",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 393,
        "name": "Посудомойка",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 51,
        "name": "Пресс для брюк",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 379,
        "name": "Проводной интернет",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 389,
        "name": "Простыни",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 397,
        "name": "Сауна",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 405,
        "name": "Свадебная",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 396,
        "name": "Сейф",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 259,
        "name": "Сейф (в номере)",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 255,
        "name": "Сейф для ноутбука",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 165,
        "name": "Семейные номера",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 60,
        "name": "Смежные номера",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 411,
        "name": "Стиральная машина",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 236,
        "name": "Стойка для одежды",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 426,
        "name": "Стол",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 381,
        "name": "Тапки",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 258,
        "name": "Тапочки",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 421,
        "name": "Телевизор",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 195,
        "name": "Телевизор",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 219,
        "name": "Телевизор с плоским экраном",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 428,
        "name": "Телефон",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 326,
        "name": "Туалетные принадлежности",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 401,
        "name": "Туалетные принадлежности",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 404,
        "name": "Утюг",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 425,
        "name": "Фен",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 211,
        "name": "Фен",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 423,
        "name": "Фитнес",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 238,
        "name": "Халат",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 385,
        "name": "Халат для душа",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 403,
        "name": "Холодильник",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 94,
        "name": "Холодильник",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 424,
        "name": "Чай",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 414,
        "name": "Чай или кофе",
        "group_id": 8,
        "group_name": "В номерах"
      },
      {
        "id": 233,
        "name": "Шкаф/гардероб",
        "group_id": 8,
        "group_name": "В номерах"
      }
    ]

      const yslyga = yslugi.find((elem,key)=>elem.id===id)
      return yslyga
}