/* async loadOrder(id: string, isAnalog: 'false' | 'true') {
    try {
      const data: { order: Iorder, properties: IProperties[] } = await this.appService.query('get', `http://localhost:3000/newOrder/loadOrder${id}/${isAnalog}`);
      if ((data as Object).hasOwnProperty('order') === false) {
        alert("Данный заказ закрыт или не существует!");
        return;
      }
      if (isAnalog === 'true') {
        if ((this.dataOrder as Object).hasOwnProperty('order_machine')) {
          const order_machine = this.dataOrder!.order_machine
          const idcustomer = this.dataOrder!.idcustomer;
          const shipment = this.dataOrder!.shipment;
          this.dataOrder = data.order;
          this.dataOrder!.order_machine = order_machine;
          this.dataOrder!.idcustomer = idcustomer;
          this.dataOrder!.shipment = shipment;
        } else {
          this.dataOrder = data.order;
        }
        this.dataChanged = true;
      }
      else {
        this.dataOrder = data.order;
        this.dataChanged = false;
      }
      if ((data as Object).hasOwnProperty('properties')) {
        this.dataProperties = data.properties;
      }
    
    } catch (error) {
      alert(error);
    }
  } */




 /*  async loadOrder(id: string, isAnalog: 'false' | 'true') {
    try {
      const data: { order: Iorder, properties: IProperties[] } = await this.appService.query('get', `http://localhost:3000/newOrder/loadOrder${id}/${isAnalog}`);
      if (!data.order) {
        alert("Данный заказ закрыт или не существует!");
        return;
      }
    
      const order = this.dataOrder?.order_machine;
      const shipment = this.dataOrder?.shipment;
      this.dataOrder = data.order;
      if (data.properties) {
        this.dataProperties = data.properties;
      }
      if (isAnalog === 'true') {
        if (order) {
          this.dataOrder!.order_machine = order;
        }
        if (shipment) {
          this.dataOrder!.shipment = shipment;
        }
      }
          let select: HTMLSelectElement;
      let options: any;
      if (isAnalog === 'false') {
            let inputDate: any;
        inputDate = document.getElementById("plane");
        inputDate.value = this.dataOrder?.shipment;
      
      }
         let i = 0;
      for (const iterator of data.properties) {
        this.dataProperties[i] = iterator;
        i++;
      }
      for (i = i; i < 14; i++) {
        this.dataProperties[i] = ({ property: "", val: "", idproperty: 0 })
      }
      if (isAnalog === 'true') {
        this.dataChanged = true;
      } else {
        this.dataChanged = false;
      }

    } catch (error) {
      alert(error);
    }
  } */