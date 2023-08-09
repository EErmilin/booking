

class MapService {
    #map;
    #reactify;
    #clusterer;


    getMap(){
        return this.#map
    }

    setMap(map){
       this.#map = map
    }
    setReactify(reactify){
        this.#reactify = reactify
    }

    getReactify(){
        return this.#reactify
    }
    setClusterer(clusterer){
        this.#clusterer = clusterer
    }

    getClusterer(){
        return this.#clusterer
    }
    getListeners(){
        let listeners = new window.ymaps3.YMapListener({
            layer: 'any',
            // Добавление обработчиков на слушатель.
            onClick: (event)=>{
                console.log(event)
            },
        })
        return listeners
    }
}


export default new MapService();