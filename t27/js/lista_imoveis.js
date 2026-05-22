var instance = []; 
var instance2 = []; 

$( document ).ready(function() {
    //SISTEMA DE TABS DO IMOVELCARD
    $('.imovelcard__info__tab').click(function(){

    let imovelid = $(this).data('imovelid');

    //verifica se esta clicando novamente em um ja ativo
    if ($(this).hasClass('ativo')) {

    $(this).removeClass('ativo');

    $('.imovelcard__info__tab__content__'+this.id+'[data-imovelid='+imovelid+']').slideUp();

    $('.imovelcard__info__tab__content[data-imovelid='+imovelid+']').slideUp();
//$('.imovelcard__info__tab__content__fotos.chocolat-parent[data-imovelid='+ imovelid +']').empty();
    }else {

    //remove a cor de todas as tabs
    $('.imovelcard__info__tab[data-imovelid='+imovelid+']').removeClass('ativo');

    //colore o tab ativo
    $(this).addClass('ativo');

    //esconde todos conteudos
    $('[class^=imovelcard__info__tab__content__][data-imovelid='+imovelid+']').hide();

    //mostra o conteudo pertinente ao data imovelid
    $('.imovelcard__info__tab__content__'+this.id+'[data-imovelid='+imovelid+']').fadeIn('fast');

    //mostra o container pertinente ao data imovelid
    $('.imovelcard__info__tab__content[data-imovelid='+imovelid+']').slideDown();

    
    if($(this).attr('id') ==  'fotos'){
   

		// console.log('.row.imovelcard__info__tab__content[data-imovelid='+ imovelid +']')
		let $conteudo = $('.row.imovelcard__info__tab__content[data-imovelid='+ imovelid +']');

		if(!$conteudo.is(':visible'))
		{
		}else{
			 
			 //return;
		}
        //$('.imovelcard__info__tab__content__fotos.chocolat-parent[data-imovelid='+ imovelid +']').empty();
	    $('.imovelcard__info__tab__content__fotos.chocolat-parent[data-imovelid='+ imovelid +']').show();

	if (instance2[ imovelid ] == 'S')
		return;

    $.ajax('/t27/lista_imoveis_fotos.php',{
      method: 'get',
      data: 'imovel='+imovelid,
      success: function(res){
        // console.log(imovelid)
        try{
            var conteudo_corpo = $.parseJSON(res);
            for (var key in conteudo_corpo) {
                if (conteudo_corpo.hasOwnProperty(key)) {

                    $('.imovelcard__info__tab__content__fotos.chocolat-parent[data-imovelid='+ imovelid +']').append(
                    '<a class="chocolat-image" href="/imagens/imoveis/'+conteudo_corpo[key].arquivo_imm+'" title="caption image 2"><img src="/imagens/imoveis/li5.php?'+conteudo_corpo[key].arquivo_imm+'" alt=""></a>'
                    )
                    
                }
            }

		
			instance[ imovelid ] = $('.chocolat-parent[data-imovelid='+ imovelid +']').Chocolat().data('chocolat');
			instance2[ imovelid ] = 'S';
			// $('.chocolat-parent[data-imovelid='+ imovelid +']').Chocolat();	

        }catch(e){
          // console.log(e)
        }

      }
    });
    
    


    }

    }
    });

    //GALERIA IMAGENS
    // $('.chocolat-parent').Chocolat();

    //SLIDE SEARCHFILTERS MOBILE
    $('.togglesearch').click(function(){
    var searchfilters = $('.searchfilters');

    if(searchfilters.css('display') == 'none') {
    searchfilters.slideDown();
    } else {
    searchfilters.slideUp();
    }
    })

    //MODAL DE FALE CONOSCO

$('.imovelcard__valor__enviarmensagem').on('click', function() {
var chavec = $('input[name=chavec]').val();
var chavecri = $('input[name=chavecri]').val();
var par = $('input[name=par]').val();


var frmNome =''; 
var frmEmail ='';
var frmTelefone ='';
frmNome = readCookie("nome") ? readCookie("nome") : '' ;
if (frmNome)
{
     frmEmail    = readCookie("email") ?  readCookie("email") : '' ;
     frmTelefone = readCookie("telefone") ? readCookie("telefone") : '';

 
}

    var imovelid = $(this).parent().attr('data-imovelid');
    // console.log(imovelid)

    var $tab = $('.imovelcard__info__tab__content[data-imovelid='+imovelid+']');
    var $tab_form = $('.imovelcard__info__tab__content__centraldenegocios[data-imovelid='+imovelid+']')
    var $tab_form_fale = $('.listaimo_faleconosco[data-imovelid='+imovelid+']');
	var formInputPar = par ? `<input name="par"       type="hidden" value="${par}">` : '' ;

	var htmlForm = `<form action="/imovel-mais-info/?acao=gravar&amp;cod=${imovelid}&amp;par=${par}" method="post" name="frmcon1" target="ifrmemi" onsubmit="return valida_ImoDetRapido(this);">
                                <input name="chavec"    type="hidden" value="${chavec}">
                                <input name="chavecri"  type="hidden" value="${chavecri}">
                                ${formInputPar}
                                <input value="${frmNome}" maxlength="80" name="nome" class="nome" type="text" placeholder="Nome" required>
                                <input value="${frmEmail}" maxlength="80" name="email" type="text" placeholder="E-mail" required>
                                <input value="${frmTelefone}" maxlength="20" name="telefone1" id="telefone11_${imovelid}" type="text" placeholder="Telefone" class="tel" required>
                                <span class="faleconosco__cod"><b>${chavec}</b> repita:</span>
                                <input class="listaimo__codinput" type="text" maxlength="4" name="chave" placeholder="" required>
                                <button type="submit" name="btnenviar3" id="btnenviar3">enviar agora</button>
                                <textarea name="mensagem" id="mensagem1" rows="2" required>Olá! Achei esse imóvel através do site. Por favor, gostaria de mais informações sobre o mesmo. Aguardo contato. Grato.</textarea>
	                          </form>`;
        $tab_form_fale.empty();
        $tab_form_fale.append(htmlForm);

		document.getElementById('telefone11_'+imovelid).addEventListener('input', function (e) {
		  var x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
		  e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
		});


    $('.modalfaleconosco').fadeIn({
    start: function () {
        $(this).css({
        display: 'flex'
        })
    } 
    });
});

$('.btnfaleconosco__fechar').on('click', function() {
    $('.modalfaleconosco').fadeOut();
});

//END MODAL DE FALE CONOSCO
});
