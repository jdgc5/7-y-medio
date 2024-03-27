class Carta {
    constructor() {
        this.baraja = new Array(48).fill(0).map((carta,index)=>{
            return {
                "numero" : (index % 12) +1 ,
                "palo" : ['espadas','bastos','copas','oros'][Math.floor(index/12)],
                "activo" : true,
            }
        }).filter((item)=>{
            return item.numero != 8 && item.numero != 9
        });
    }
    

}

export { Carta };

