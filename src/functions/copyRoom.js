import {createHotelRoom, createRoomTariff, сreateBed} from "../store/actions/partnerHotelsActions";

export async function copyRoom (dispatcher,roomInfo){
    const formatInfo = (()=>({
        ...roomInfo,
        name:{
            ru:roomInfo.name.ru
        },
        description:{
            ru:roomInfo.description.ru
        },
        images:[],
        main_image:null,
    }))()
    const room_id = await dispatcher(createHotelRoom(formatInfo,formatInfo.hotel_id))
    if(formatInfo && formatInfo.tariffs && formatInfo.tariffs.length){
        formatInfo.tariffs.forEach(elem=>{
            return dispatcher(createRoomTariff({...elem,room_id:room_id}))
        })

    }
    if(formatInfo.beds.length){
        formatInfo.beds.forEach(elem=>{
            return dispatcher(сreateBed({...elem,room_id:room_id}))
        })

    }
}