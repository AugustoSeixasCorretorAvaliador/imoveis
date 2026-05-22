/** @class Classe Representando o Popup. */
function Popup(opcoes) {


    /**
     * Cria um instância de um Popup
     *
     * @constructor
     * @author: kayque
     * @param {object} opcoes Contendo opções de inicialização.
     */

      /** @private */ this.visualizado = false;
      /** @private */ this.startTime = new Date();
      /** @private */ this.endTime = '';




  this.setVisualizado = function (val) {
    this.visualizado = val;
  }

  this.getVisualizado = function () {
    return this.visualizado;
  }

  this.setEndTime = function () {
    this.endTime = new Date();
  }

  this.getEndTime = function () {
    return this.endTime;
  }

       /** @private */  this.opcoes = {
    popupTipo: opcoes.popupTipo,
    identificador: opcoes.identificador,
    codImovel: opcoes.codImovel,
    par: opcoes.par,
    popupCodigo: opcoes.popupCodigo,
    delayExibir: opcoes.delayExibir,
    modoForcado: opcoes.modoForcado,
    periodicidade: opcoes.periodicidade,
    titulo: opcoes.titulo,
    imagemUrl: opcoes.imagemUrl,
    conteudo: opcoes.conteudo,
    imagemSup: opcoes.imagemSup,
    imagemInf: opcoes.imagemInf,
    rodape: opcoes.rodape,
    campos: opcoes.campos,
    posicao: opcoes.posicao,
    toast: opcoes.toast,
    efeito: opcoes.efeito,
    classeFundo: opcoes.classeFundo,
    classeConteudo: opcoes.classeConteudo,
    usarFormulario: opcoes.usarFormulario,
  }



  this.abrePopup = async function () {

    let _self = this;

    const formValues = await Swal.fire({
      title: this.opcoes.titulo,
      imageUrl: this.opcoes.imagemUrl,
      footer: this.opcoes.rodape,
      showCloseButton: true,
      confirmButtonText: 'Enviar',
      confirmButtonColor: '#3085d6',

      showConfirmButton: this.opcoes.usarFormulario,
      toast: this.opcoes.toast,
      position: this.opcoes.posicao,
      html: this.opcoes.conteudo + ' ' + this.opcoes.campos,
      focusConfirm: false,
      allowOutsideClick: false,
      showLoaderOnConfirm: true,
      customClass: {
        popup: this.opcoes.efeito + ' animated_imobi ' + this.opcoes.classeConteudo,
        container: this.opcoes.classeFundo,
      }, 
      didClose: function () {

        if (!_self.opcoes.modoForcado)
          _self.setCookie(_self.opcoes.popupCodigo, "visualizado", _self.opcoes.periodicidade);

      },
      didOpen: function () {
        if (document.querySelector('.campo_popup[placeholder=Telefone]'))
          VMasker(document.querySelector('.campo_popup[placeholder=Telefone]')).maskPattern("(99) 99999-9999");

        document.querySelector('.swal2-close').addEventListener("click", function (e) {
          
          try {

            document.querySelector('.swal2-container').style.display = 'none';
            document.querySelector('body').classList.remove('swal2-shown');
            document.querySelector('body').classList.remove('swal2-height-auto');
            document.querySelector('html').classList.remove('swal2-shown');
            document.querySelector('html').classList.remove('swal2-height-auto');
            if (!_self.opcoes.modoForcado){
              _self.setCookie(_self.opcoes.popupCodigo, "visualizado", _self.opcoes.periodicidade);
            }
          } catch {

          }
        });
      },
      preConfirm: () => {
        var retorno = [];

        document.querySelectorAll('input[name="campos"]').forEach(function (e, i) {


          if (!_self.validar(e)) {
            e.style.borderColor = 'red';
            e.classList.add('animated_imobi', 'pulse_imobi');
            setTimeout(function () { e.classList.remove('animated_imobi'); e.classList.remove('pulse_imobi') }, 1000)

            return retorno = false;
          }
          /*
         if(!e.value){
           e.style.borderColor = 'red';
           return retorno = false;
          
         } */
          e.style.borderColor = '#d4d7da';
          try {
            if (e.getAttribute('placeholder'))
              retorno.push({ campo: e.getAttribute('placeholder'), valor: e.value });
            else
              retorno.push({ campo: 'campo', valor: e.value });
          } catch (error) {
            //console.log(1)
            return retorno = false;
          }


        });

        return retorno;
      }
    })


    
    if (!formValues.isDismissed) {
      //console.log(formValues)
      Swal.fire({
        icon: 'success',
        title: 'Enviado com sucesso!'
      })

      var formData = new FormData();
      formData.append('acao', 'inserir_mensagem');
      formData.append('codImovel', this.opcoes.codImovel);
      formData.append('identificador', this.opcoes.identificador);
      if (formValues.value) {
        for (var x = 0; x < formValues.value.length; x++) {
          console.log(formValues.value[x])
          formData.append(formValues.value[x].campo, formValues.value[x].valor)
        }
      }
      var xhttp = new XMLHttpRequest();
      xhttp.open("POST", "/contato?acao=modpopup&par=" + this.opcoes.par, true);

      xhttp.send(formData);


      //console.log(formData);
    }

    this.shown = true;
  }
  this.escondePopup = function () {



  }


  this.temporizador = function () {

    this.setEndTime();

    var dif = this.endTime - this.startTime;
    //console.log(dif)
    if (dif >= this.opcoes.delayExibir)
      return true;

    return false;

  }


  /**
   * Valida inputs
   *
   * @method
   */
  this.validar = function (elemento) {

    switch (elemento.getAttribute('placeholder')) {
      case 'Nome':
        return elemento.value !== '' && elemento.value.length > 4 && elemento.value.length < 30;
        break;
      case 'Telefone':
        return elemento.value !== '' && elemento.value.length > 8 && elemento.value.length < 21;
        break;
      case 'E-mail':
        return elemento.value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        break;
      case 'Endereço':
        return elemento.value !== '' && elemento.value.length > 4 && elemento.value.length < 45;
        break;
      default:
        return elemento.value !== '' && elemento.value.length > 1 && elemento.value.length < 140;
        break;
    }

  }



  this.setCookie = function (codCookie, cvalue, exdays) {
    var d = '', expires = '';

    if (exdays > 0) {
      d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      expires = "expires=" + d.toUTCString();
      document.cookie = codCookie + "=" + cvalue + ";" + expires + ";path=/";
    } else {
      d = new Date();
      d.setSeconds(d.getSeconds() - 1);  
      expires = "expires=" + d.toUTCString();
      document.cookie = codCookie + "=; " + expires + "; path=/";
    }
  }


  this.checkCookie = function (codCookie, cvalue, exdays) {
    var cookie = this.getCookie(codCookie);
    if (cookie != "") {
      if (exdays > 0) {
        this.setVisualizado(true);
      }
    } else {
      //this.setCookie(codCookie,cvalue,exdays)

      //console.log('cookie'+codCookie+' ReDefinido'+' Valor '+cvalue+' tempo '+exdays);
    }
  }



  this.getCookie = function (codCookie) {
    var name = codCookie + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  /**
   * Carrega e append css utilizado pelo modal 
   * 
   */
  this.loadCss = function () {


    //console.log(this.visualizado)


    var css = [
      `
              .swal2-container {
                  overflow-y: auto !important;
                  width: 100% !important;
                  height: 100% !important;
              }`,
      `
              body.swal2-shown{
                  overflow: auto !important;
              }`,
      `.swal2-image{
                  margin: 0.8em auto;
              }`,
      `.container_sem_fundo{
                  background-color: rgba(0,0,0,0) !important;
              }`,
      `.conteudo_box_shadow{
                  box-shadow: 1px 1px 3px 2px #6a6a6a82;
              }`,
      `body.swal2-toast-column .swal2-toast{
                  height: 95% !important;
                  overflow: auto !important;
              }`,

      `.swal2-popup.swal2-toast .swal2-header {
                  flex-direction: row-reverse !important;
              }`,

      `.campo_popup{
                color: #000000 !important;
                font-family: Verdana !important;
                font-size: 11px !important;
                border: solid 1px #CCCCCC ;
                height: 30px !important;
                width: 100% !important;
                background-color: #FFFFFF !important;
                border-radius: 3px !important;
                padding-left: 5px !important;
                margin-bottom: 0.8em !important;
                position: relative !important;
                }`,
      `.swal2-content iframe{
                    
  
                }`,
      `.swal2-popup{
                  
                  display:block !important;
                  overflow: hidden;
                  padding: 20px !important;
                  width: auto !important;
                  max-width: 90% !important;
                }`,
      `#swal2-content{
                  display: inline-block !important;
                  margin: 0 auto !important;
                  padding-top: 0px;
                  
                }`,
      `#swal2-content h2, #swal2-content h3, #swal2-content h4{
                  font-weight: normal;
                  
                }`,
      `.swal2-close{
                  color: #000;
                }`,
      `.swal2-actions button{
                  margin: 0 .3125em !important;
                  padding: .6em 3em !important;
                  font-size: 1em !important;
                  text-transform: uppercase !important;
                }`,
      `.resetar_popup,.resetar_popup *,.resetar_popup a:hover,.resetar_popup a:visited,.resetar_popup a:active{
                  background:none;
                  border:none;
                  bottom:auto;
                  clear:none;
                  cursor:default;
                  /* didn't really know what the default for display should be*/
                  /*display:inline;*/
                  float:none;
                  font-family:Arial, Helvetica, sans-serif;
                  font-size:medium;
                  font-style:normal;
                  font-weight:normal;
                  height:auto;
                  left:auto;
                  letter-spacing:normal;
                  line-height:normal;
                  max-height:none;
                  max-width:none;
                  min-height:0;
                  min-width:0;
                  overflow:visible;
                  position:static;
                  right:auto;
                  text-align:left;
                  text-decoration:none;
                  text-indent:0;
                  text-transform:none;
                  top:auto;
                  visibility:visible;
                  white-space:normal;
                  width:auto;
                  z-index:auto;
              }`

    ];
    style = document.createElement('style');
    head = document.head || document.getElementsByTagName('head')[0]
    head.appendChild(style);
    css.forEach(element => {
      style.appendChild(document.createTextNode(element));
      //console.log('adicionado')
    });



  }

  /**
   * Adiciona evento de acordo com tipo de popup
   * 
   * @method
   */

  this.addEvent = function (self) {

    if (opcoes.modoForcado)//Modo DEBUG
      self.setVisualizado(false);



    if (self.getVisualizado())
      return;

    if (self.opcoes.popupTipo == 'IS') {
      //console.log(document)
      document.addEventListener("mouseout", function (e) {
        //console.log(opcoes.modoForcado)  

        if (self.getVisualizado() && !opcoes.modoForcado)
          return;

        if (self.temporizador())
          if (e.clientY < 0) {
            self.abrePopup();

            self.setVisualizado(true);
          }
      }, false);
    }

    if (self.opcoes.popupTipo == 'PP') {


      if (self.opcoes.modoForcado)//Modo DEBUG
        self.setVisualizado(false);


      if (self.getVisualizado())
        return;

      setTimeout(() => {
        self.abrePopup();
        self.setVisualizado(true);
      }, self.opcoes.delayExibir * 1000);



    }

    if (self.opcoes.popupTipo == 'AL') {


      if (self.opcoes.modoForcado)//Modo DEBUG
        self.setVisualizado(false);

      if (self.getVisualizado())
        return;


      setTimeout(() => {
        self.abrePopup();
        self.setVisualizado(true);
      }, self.opcoes.delayExibir * 1000);
    }



  }


  /**
   * Inicializa e adiciona eventos do DOM
   *
   * @method
   */
  this.init = function () {
    //console.log(this.startTime)

    var self = this;

    self.loadCss();

    if (!self.opcoes.modoForcado)
      self.checkCookie(this.opcoes.popupCodigo, "visualizado", this.opcoes.periodicidade);

    self.addEvent(self);

  }

};



