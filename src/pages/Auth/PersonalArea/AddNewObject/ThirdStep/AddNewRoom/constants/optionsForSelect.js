import classes from "../AddNewRoom.module.scss"
//TODO удалить когда появиться API
export const fakeRoomType = [
    {
        label:"Апартаменты",
        value:1
    },
    {
        label:"Люкс",
        value:2
    },
    {
        label:"Полулюкс",
        value:3
    },
    {
        label:"Делюкс",
        value:4
    },
    {
        label:"Стандартный номер",
        value:5
    },
    {
        label:"Одноместный номер эконом-класса",
        value:6
    },
    {
        label:"Одноместный стандартный номер",
        value:7
    },
    {
        label:"Одноместный улучшенный номер",
        value:8
    },
    {
        label:"Одноместный Полулюкс",
        value:9
    },
    {
        label:"Двухместный номер эконом-класса",
        value:10
    },
    {
        label:"Двухместный стандартный номер",
        value:11
    },
    {
        label:"Двухместный улучшенный номер",
        value:12
    },
    {
        label:"Двухместный Полулюкс",
        value:13
    },
    {
        label:"Двухместный номер делюкс",
        value:14
    },
    {
        label:"Трёхместный номер эконом-класса",
        value:15
    },
    {
        label:"Трёхместный улучшенный номер",
        value:16
    },
    {
        label:"Трёхместный полулюкс",
        value:17
    },
    {
        label:"Четырёхместный номер эконом-класса",
        value:18
    },
    {
        label:"Четырёхместный Улучшенный номер",
        value:19
    },
    {
        label:"Классический семейный номер",
        value:20
    },
    {
        label:"Улучшенный семейный номер",
        value:21
    },
    {
        label:"Семейный Люкс",
        value:22
    },
    {
        label:"Улучшенный Люкс",
        value:23
    },
    {
        label:"Двухкомнатный Люкс",
        value:24
    },
]
export const fakeSmokeOption = [
    {
        label:"Курящие и не курящие",
        value:1
    },
    {
        label:"Только некурящие",
        value:2
    },
    {
        label:"Только курящие",
        value:3
    },
]
export const kitchenOptions = [
    {
        label:<div className={classes.select_item}>Не выбрано</div>,
        value:null
    },
    {
        label:"Есть",
        value:1
    },
    {
        label:"Нет",
        value:0
    }
]
export const roomCapacity = [
    {
        label:<div className={classes.select_item}>Не выбрано</div>,
        value:null
    },
    {
        label:"1",
        value:1
    },
    {
        label:"2",
        value:2
    },
    {
        label:"3",
        value:3
    },
    {
        label:"4",
        value:4
    },
    {
        label:"5",
        value:5
    },
    {
        label:"6",
        value:6
    },
    {
        label:"7",
        value:7
    },
    {
        label:"8",
        value:8
    },
    {
        label:"9",
        value:9
    },
    {
        label:"10",
        value:10
    }
]
export const guestOption = [
    {value:1,label:1},
    {value:2,label:2},
    {value:3,label:3},
    {value:4,label:4},
    {value:5,label:5},
    {value:6,label:6},
]