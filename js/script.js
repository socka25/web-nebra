$(function () {
  //refresh page
  filter_data();

  /**FILTER - functionality.
   * Temporarily disables search bar, shows loading spinner with delay and sends AJAX request
   * on refresh or filter request by user
  */
  function filter_data() {
   
    //disable search bar when loading
    $("nav .search_input").prop("disabled", true);
   
    var spinnerDelay = 1000;
    setTimeout(function () {
      if ($("#drinks_box").children().length === 0 && $("#spinner").length === 0) {
        if (!$("#drinks_box").is(":visible")) {
          $("#drinks_box").fadeIn();
        }

        $("#drinks_box").html(
          '<div id="spinner" style="background-image: url(&apos;img/spinner.svg&apos;)"></div>'
        );
        
        $("#spinner").hide().fadeIn(500);
        
      }
    }, spinnerDelay);

    //data to be sent
    var action = "load_drinks",
        price = $("#price input[name=price]:checked").val(),
        alcoholic = $("#alco input[name=alco]:checked").val(),
        deadly = $("input[name=deadly]:checked").val(),
        inflammatory = $("input[name=inflammatory]:checked").val(),
        shuffle = $("#random").val();

    //database request
    $.ajax({
      url: "./partials/homepage/load_drinks.php",
      method: "POST",
      data: {
        action: action,
        price: price,
        alcoholic: alcoholic,
        deadly: deadly,
        inflammatory: inflammatory,
        shuffle: shuffle,
      },

      success: function (data) {
        
        //enable search bar after data is loaded
        $("nav .search_input").prop("disabled", false);

        //fade-in animation after data is loaded
        var speed = 500;
        $("#drinks_box")
          .html(data)
          .hide()
          .stop()
          .fadeIn(speed);
        
      },
    });
  }

  //SEARCH BAR
  //functionality
  $("nav .search_input").keyup(function () {
    var filter = $("nav .search_input")
          .val()
          .toUpperCase() //search is not case-sensitive
          .normalize("NFD").replace(/[\u0300-\u036f]|\s/g, ""), //search doesn't follow diacritics
        li = $("#drinks_box .card");
    li.each(function () { //match check
      var txtValue = $(this).find(".content h2").text();
      if (
        txtValue
          .toUpperCase()
          .normalize("NFD").replace(/[\u0300-\u036f]|\s/g, "")
          .indexOf(filter) > -1
      ) {
        $(this).show(); //if matches => show/leave visible
      } else {
        $(this).hide(); //if doesn't match => hide
      }
    });

    var results = $("#drinks_box .card:visible"), //number of search results
        noMatch = "??iadne v??sledky"; //"NO MATCH" message

    if (results.length == 0 && $("#drinks_box > h3").length == 0) { //if there are 0 results and "NO MATCH" header is not present
      $("<h3>"+ noMatch +"</h3>").appendTo("#drinks_box"); //create "NO MATCH" message
    } else if (results.length > 0 && $("#drinks_box > h3").length) { //if there are any results and "NO MATCH" header is stil present
      $("#drinks_box h3").remove(); //remove "NO MATCH" message
    }
  });

  //clear icon
  var clearIcon = $("nav .clear_icon"),
      searchBar = $("nav .search_input");

  //show clear icon when search bar input is not empty and hide it if it is
  searchBar.on("keyup", function () {
    if (searchBar.val() && !clearIcon.is(":visible")) {
      clearIcon.fadeIn(500);
    } else if (!searchBar.val()) {
      clearIcon.fadeOut(500);
    }
  });
  
  //refresh data, clear out search bar input and hide clear icon on clicking at the clear icon
  clearIcon.on("click", function () {
    filter_data();
    searchBar.val("");
    clearIcon.fadeOut(500);
  });

  //FILTER SLIDER
  //filter - options' initial opacity 
  $("#filter_slider div").css("opacity", 0);

  //slider dole
  function goDown(object, content, slideSpeed, optionsFadeSpeed) {
    var slider = $(object),
        options = $(object + " " + content);

    if (options.css("opacity") == 0) {
      $("nav").stop().animate(
        {
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        },
        100,
        function () {
          slider.slideDown(slideSpeed, function () {
            options.animate({ opacity: "1" }, optionsFadeSpeed);
          });
        }
      );
    }
  }
  //slider hore
  function goUp(object, content, slideSpeed, optionsFadeSpeed, callback) {
    var slider = $(object),
        options = $(object + " " + content);

    if (options.css("opacity") == 1) {
      options.animate({ opacity: "0" }, optionsFadeSpeed, function () {
        slider.slideUp(slideSpeed, function () {
          $("nav").stop().animate(
            {
              borderBottomLeftRadius: "20px",
              borderBottomRightRadius: "20px",
            },
            100
          );

          if (typeof callback === 'function') { 
            callback(); 
          }
        });
      });
    }

  }

  //filter - slide-down/-up animation
  $('.logo').on("click", function() {
    var speed = 100;
    //slide-down
    goUp("#menu_slider", "div", speed, speed, function() {
      goDown("#filter_slider", "div", speed, speed);
    });
    if ($("#menu_slider div").css("opacity") == 0 || $("#menu_slider").length == 0) {
      goDown("#filter_slider", "div", speed, speed);
    }
    
    //slide-up
    goUp("#filter_slider", "div", speed, speed);
  });

  //OK button
  $("#ok").on("click", function (e) {
    e.preventDefault();
    $("#drinks_box").hide().empty();
    filter_data();
    $("nav .search_input").val("");
  });

  //SHUFFLE button
  $("#shuffle").on("click", function (e) {
    e.preventDefault();
    $("#random").val(1);
    $("#drinks_box").hide().empty();
    filter_data();
    $("#random").val("");
  });

  //FILTER - RADIO INPUTS - options' select, values & animation
  $("#filter_slider div a:not([id])").on("click", function (e) {
    e.preventDefault();
    var a = $(this),
      cl = a.attr("class").split(" ")[0],
      input = $("input:radio[name=" + cl + '][value="' + a.data(cl) + '"]');

    if (a.hasClass("selected")) {
      input.prop("checked", false);
      a.removeClass("selected");
    } else {
      input.prop("checked", true);
      a.addClass("selected")
       .siblings().removeClass("selected");
    }
  });

  //FILTER - CHECKBOX INPUTS - options' select, values & animation
  $("#checkbox > a").on("click", function (e) {
    e.preventDefault();
    var a = $(this),
      id = a.attr("id"),
      input = $("input[name=" + id + "]");

    if (a.hasClass("selected")) {
      input.prop("checked", false);
      a.removeClass("selected");
    } else {
      input.prop("checked", true);
      a.addClass("selected");
    }
  });


  /* ORDER */

  //pri na????tan?? zr??ta?? drinky v objedn??vke, pridan?? cez SESSION
  sumUpdate();
  
  //opacita na nulu pre v??etky div elementy v menu slideri
  $("#menu_slider div").css("opacity", 0);


  //vytvorenie arrayu z objedn??vky a poslanie ho cez AJAX request na ist?? adresu
  function sendOrder(path, callback) {
    var order = {};
    $("#menu_slider .my_order .order_item").each(function() {
      var drink_id = Number($(this).find("option:selected").val()),
          drink_name = $(this).find("option:selected").text(),
          drink_amount = Number($(this).find(".amount").html()),
          drink_price = Number($(this).find(".drink_price").html()).toFixed(2),
          drink_sum = Number($(this).find(".drink_sum").html()).toFixed(2);
      if (drink_id) {
        order[drink_id] = {
          name: drink_name,
          amount: drink_amount,
          price: drink_price,
          sum: drink_sum
        };
      }
    });

    $.ajax({
      url: path,
      method: "POST",
      data: {order: order},
      success: function() {
        if (typeof callback === 'function') { 
          callback();
        }
      }
    });
  };

  //??as?? funkcie itemUpdate(), ktor?? aktualizuje celkov?? s????et cien v objedn??vke
  function sumUpdate() {
    var sum = 0.00,
        orderItems = Boolean($("#menu_slider .my_order .order_item").length);

    //zr??tame ceny v??etk??ch drinkov n??soben?? po??tom ich kusov (trieda drink_sum)
    $('#menu_slider .my_order .drink_sum').each(function() {
        sum += Number($(this).html());
    });

    //pokia?? v objedn??vke nie s?? ??iadne drinky, tak nastav??me sumu na 0.00 - ak ??no, tak zaokr??h??ujeme na 2 desatinn?? miesta
    if (!sum) {
      $("#menu_slider .order_sum").html("0.00");
    } else {
      $("#menu_slider .order_sum").html(sum.toFixed(2));
    }

    //pokia?? je  po??et drinkov v objedn??vke 0, tak znefunk??n??me tla??idlo "Objednan??" - ak nie tak ho sfunk??n??me
    if (!orderItems) {
      $("#make_order").addClass("disabled");
    } else if($("#make_order.disabled.unselectable")) {
      $("#make_order").removeClass("disabled");
    }
  }

  //funkcia, ktor?? m?? nastaros?? celkov?? aktualiz??ciu objedn??vky, po zmene ??dajov nejak??ho drinku a prenesenie mno??stva na tag karty drinku - atrib??t je polo??ka .order_item
  function itemUpdate(item) {
    var id = item.find("select").val(),
        drinkCardId = "#drink-" + id,
        price = $(drinkCardId).find(".price_tag span").html(),
        amount = Number(item.find(".amount").html()),
        drink_sum = (amount * price);
    
    //aktualizujeme ??daj o cene drinku v menu slideri
    item.find(".drink_price").html(price);

    //ak je s????et ceny za ist?? drinky nenulov??, tak ho zaokr??hlime a aktualizujeme po??et drinkov na karti??ke
    //- ak nie tak len nastav??me dan?? s????et na 0.00
    if (drink_sum) {
      item.find(".drink_sum").html(drink_sum.toFixed(2));
      $(drinkCardId).find(".add div:visible").html(amount);
    } else {
      item.find(".drink_sum").html("0.00");
    }
    
    //vyberieme v??etky karty s drinkami, ??o maj?? tag s po??tom dan??ch drinkov v objedn??vke
    //a pokia?? sa u?? drink s ich ID v objedn??vke nenach??dza, tak tento tag schov??me
    $("#drinks_box .card").has(".add div:visible").each(function() {
      var id = $(this).attr("id").replace('drink-', ''),
          isInOrder = $("#menu_slider .order_item option[value=" + id + "]:selected");
      
      if(isInOrder.length == 0) {
        $(this).find(".add div").fadeOut(200);
      }
    });

    //pokia?? mal drink svoj tag skryt??, tak ho zvidite??n??me a nastav??me na hodnotu 1
    var tag = $(drinkCardId).find(".add div:hidden");
    tag.html("1");
    tag.fadeIn(200);

    //aktualizujeme v??po??ty
    sumUpdate();
    //aktualizujeme SESSION
    sendOrder("_inc/user/order_session.php");
  }

  //funkcia prid??vaj??ca drink do objedn??vky pod??a ID - ke?? nie je ID k zadan??, tak sa prid?? pr??zdna polo??ka
  function addItem(id) {
    //k??pia pr??zdnej polo??ky
    var item = $("#blank_item .order_item").clone();
    if (id) {
      //pokia?? u?? polo??ka v objedn??vke je, tak jej iba zv????????me po??et ks - ak nie, tak ju do objedn??vky prid??me s 1ks
      var checkIfExists = $(".order_item option[value='" + id + "']").is(':selected');
      if (checkIfExists) {
        item = $(".order_item option[value='" + id + "']:selected").closest(".order_item");
        newAmount = Number(item.find(".amount").html()) + 1;
        item.find(".amount").html(newAmount);

      } else {
        item.find("select").val(id);
        $("#menu_slider .my_order").append(item);

      }
    } else {
      $("#menu_slider .my_order").append(item);
    }

    //aktualizujeme v??po??ty objedn??vky a karti??ky drinkov
    itemUpdate(item);
  }

  //toggle menu slideru po kliknut?? na menu ikonku
  $('#menu').on("click", function(e) {
    e.preventDefault();
    var speed = 100;

    //slide-down
    goUp("#filter_slider", "div", speed, speed, function() {
      goDown("#menu_slider", "div", speed, speed);
    });
    if ($("#filter_slider div").css("opacity") == 0) {
      goDown("#menu_slider", "div", speed, speed);
    }

    //slide-up
    goUp("#menu_slider", "div", speed, speed);

  });
  
  //pridanie pr??zdnej polo??ky do objedn??vky
  $("#add").on("click", function(e) {
    e.preventDefault();
    addItem();
  });

  //vymazanie polo??ky z objedn??vky
  $("#menu_slider .my_order").on("click", ".delete_button", function(e) {
    e.preventDefault();

    //vr??tane delete_buttonu
    var item = $(this).closest(".order_item");
    item.addBack().remove();

    itemUpdate(item)
  });

  //pri zmene drinku cez select sa objedn??vka aktualizuje
  $("#menu_slider .my_order").on("change", "select", function() {
    item = $(this).closest(".order_item");
    itemUpdate(item);
  });

  //pri stla??en?? jedn??ho z buttonov (plus_button a minus_button) zv????????me/zmen????me mno??stvo
  $("#menu_slider .my_order").on("click", "button", function(e) {
    e.preventDefault();
    var item = $(this).closest(".order_item"),
        button = $(this).attr("class"),
        amount = $(this).closest(".order_item").find(".amount"),
        value = Number(amount.html()),
        min = 1,
        max = 99;
    if (button == "plus_button" && amount.html() != max) {
      newAmount = value + 1;
      amount.html(newAmount);
    } else if (button == "minus_button" && amount.html() != min) {
      newAmount = value - 1;
      amount.html(newAmount);
    }
    
    itemUpdate(item);
  });

  //po stla??en?? tla??idla "Objednan??"
  $("#make_order").on("click", function(e) {
    e.preventDefault();
    var orderItems = Boolean($("#menu_slider .my_order .order_item").length);

    if (orderItems) {
      //odo??le sa objedn??vka
      sendOrder("_inc/user/add_to_order.php", function() {
        //vypr??zdni sa objedn??vka v menu slideri
        $("#menu_slider .my_order").empty();
        
        //zmizn?? tagy s po??tom drinkov v objedn??vke na karti??k??ch drinkov
        $("#drinks_box .card .add div:visible").each(function() {
          $(this).html("").fadeOut(200);
        });

        //tla??idlo "Zaplaten??" sa sfunk??n??
        $("#pay.disabled").removeClass("disabled");
        //aktualizuj?? sa po??ty
        sumUpdate();
        //aktualizuje sa SESSION
        sendOrder("_inc/user/order_session.php");
      });
    }
  });

  //po kliknut?? na karti??ku drinku sa zv???????? po??et ks tu aj v objedn??vke v menu slideri
  $("#drinks_box").on("click", ".add", function() {
    var id = $(this).closest(".card").attr("id").replace('drink-', '');

    addItem(id);
  });

  //OBJEDN??VKY
  var box = $("#orders_box"),
      spinner = $('<div id="spinner" style="background-image: url(&apos;img/spinner.svg&apos;)"></div>'),
      limit = 10,
      offset = $("#orders_box .order_card").length,
      areItemsLeft = 1;

  //pokia?? zoskrolujeme ??plne dole, nie s?? e??te na????tan?? v??etky objedn??vky a po??et objedn??vok nie je 0 tak sa na????taj?? ??al??ie objedn??vky z datab??ze
  $(window).scroll(function() {
    var scrollHeight = $(document).height() - 20;
    var scrollPosition = $(window).height() + $(window).scrollTop();
    if ((scrollHeight - scrollPosition) <= 0 && areItemsLeft != 0 && offset != 0) {
      //zobraz spinner
      spinnerClone = spinner.clone();
      box.append(spinner);

      var request = $.ajax({
        url: "./_inc/user/load_orders.php",
        method: "POST",
        data: {offset: offset, limit: limit}
      });
      request.done(function(data) {
        var items = $(data).find(".order_card");
        numberOfItemsLeft = items.length;

        //pokia?? je u?? po??et objedn??vok men???? ako limit (s?? posledn?? na na????tanie), tak nastav??me premenn?? areItemsLeft na 0 a akcia sa u?? nebude opakova??
        if (numberOfItemsLeft == limit) {
          box.append(items);
        } else if(numberOfItemsLeft < limit) {
          box.append(items);
          areItemsLeft = 0;
        }
        
        offset = offset + limit;
      });
      request.fail(function() {
        alert("Server error");
      });
      request.always(function() {
        $('#spinner').remove();
      });
    }
  });

  //LOGIN/SIGNUP
  //schova??/zobrazi?? heslo pri p??san??
  $('#show_password input').removeAttr('checked');
  $(".password[type='text']").attr("type", "password");
  $("#show_password").on("click", function() {
    var x = $(this).prev("input");

    if (x.attr("type") === "password") {
      x.attr("type", "text");
    } else {
      x.attr("type", "password");
    }
  })

});