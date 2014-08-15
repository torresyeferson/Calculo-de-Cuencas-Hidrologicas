Ext.Loader.setConfig({
enabled: true
        });
        Ext.Loader.setPath('Ext.ux', 'extjs-docs-5.0.0/extjs-build/build/examples/ux');
        Ext.require([
                'Ext.grid.*',
                'Ext.data.*',
                'Ext.util.*',
                'Ext.Action',
                'Ext.tab.*',
                'Ext.button.*',
                'Ext.form.*',
                'Ext.layout.container.Card',
                'Ext.layout.container.Border',
                'Ext.ux.PreviewPlugin',
                'Ext.state.*',
                'Ext.form.*',
                'Ext.ux.form.MultiSelect',
                'Ext.ux.form.ItemSelector',
                'Ext.ux.ajax.JsonSimlet',
                'Ext.ux.ajax.SimManager',
                'Ext.ux.grid.FiltersFeature',
                'Ext.selection.CellModel',
                'Ext.ux.CheckColumn',
                'Ext.ux.Spotlight'
                ]);
        var tabPanelReports;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
        var filters = {
        ftype: 'filters',
                // encode and local configuration options defined previously for easier reuse
                encode: false, // json encode the filter query
                local: true, // defaults to false (remote filtering)

                // Filters are most naturally placed in the column definition, but can also be
                // added here.
                filters: [{
                type: 'boolean',
                        dataIndex: 'visible'
                }]
                };
        var spot = Ext.create('Ext.ux.Spotlight', {
        easing: 'easeOut',
                duration: 500
                });
        var mensaje = '';
        Ext.onReady(function() {
        Ext.apply(Ext.form.field.VTypes, {
        daterange: function(val, field) {
        var date = field.parseDate(val);
                if (!date) {
        return false;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() !== this.dateRangeMax.getTime()))) {
        var start = field.up('form').down('#' + field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() !== this.dateRangeMin.getTime()))) {
        var end = field.up('form').down('#' + field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
        }
        /*
         * Always return true since we're only using this vtype to set the
         * min/max allowed values (these are tested for after the vtype test)
         */
        return true;
        },
                daterangeText: 'La fecha de inicio debe ser menor que la fecha de finalización',
                password: function(val, field) {
                if (field.initialPassField) {
                var pwd = field.up('form').down('#' + field.initialPassField);
                        return (val === pwd.getValue());
                }
                return true;
                },
                passwordText: 'Las Contraseñas no coinciden',
                cedulaValida: function(val, field) {
                if (val.length !== 10) {
                return false;
                }

                if (val.length === 10) {
                if (check_cedula(val)) {
                return true;
                } else {
                return false;
                }
                }
                return true;
                },
                cedulaValidaText: 'Numero de Cedula Invalida',
                placaValida: function(val, field) {
                var partes = val.split("");
                        if (partes.length === 7) {
                if (!/^[A-Z]{3}[0-9]{4}$/.test(val)) {
                return false;
                } else {
                return true;
                }
                } else {
                if (!/^[A-Z]{3}[0-9]{3}$/.test(val)) {
                return false;
                } else {
                return true;
                }

                }
                },
                placaValidaText: 'Ingrese un numero de placa valido(LAB3532, 3 letras ; 3 o 4 numeros)',
                numeroTelefono: function(val, field) {
                var partes = val.split("");
                        if (partes.length === 10) {
                if (!/^[0]{1}[9]{1}[0-9]{8}$/.test(val)) {
                return  false;
                } else {
                return  true;
                }
                } else {
                if (!/^[0]{1}[7]{1}[0-9]{7}$/.test(val)) {
                return  false;
                } else {
                return true;
                }
                }
                },
                numeroTelefonoText: 'Ingresar solo caracteres numéricos válidos <br>que empiezen con [09] movil tamaño de (10)dígitos<br> 0 [072] convencional tamaño de (9)dígitos ',
                emailNuevo: function(val, field) {
                if (!/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/.test(val)) {
                return  false;
                }
                return true;
                },
                emailNuevoText: 'Dede ingresar segun el formato kradac@kradac.com <br>sin caracteres especiales',
                campos: function(val, field) {
                if (!/^[-0-9.A-Z.a-z.áéíóúñ\s*]{2,80}$/.test(val)) {
                return  false;
                }
                return true;
                },
                camposText: 'Solo carateres alfa numéricos<br> Tamaño min de 3 y un máx de 80 carateres',
                //Metodo utilizado para controlar caracteres alfanuericos y el tamano del campo "Reg. Municipal"
                //del archivo administracion de buses (vehicle.js)
                camposVehicleMax10: function(val, field) {
                if (!/^[-0-9.A-Z.a-z.áéíóúñ\s*]{5,10}$/.test(val)) {
                return  false;
                }
                return true;
                },
                camposVehicleMax10Text: 'Solo carateres alfa numéricos<br> Tamaño min de 5 y un máx de 10 carateres',
                //Metodo utilizado para controlar caracteres alfanuericos y el tamano de los campos
                //del archivo administracion de buses (vehicle.js) que requieren un tamano de entre 2 y 45 caracteres
                camposVehicleMax45: function(val, field) {
                if (!/^[-0-9.A-Z.a-z.áéíóúñ\s*]{5,45}$/.test(val)) {
                return  false;
                }
                return true;
                },
                camposVehicleMax45Text: 'Solo carateres alfa numéricos<br> Tamaño min de 5 y un máx de 45 carateres',
                campos1: function(val, field) {
                if (!/^[-0-9.A-Z.a-z.áéíóúñ\s*]{2,80}$/.test(val)) {
                return  false;
                }
                return true;
                },
                campos1Text: 'Solo carateres alfa numéricos<br> Tamaño min de 1 y un máx de 80 carateres',
                camposMin: function(val, field) {
                if (!/^[0-9A-Za-zñ\s*]{3,10}$/.test(val)) {
                return  false;
                }
                return true;
                },
                camposMinText: 'Solo carateres alfa numéricos<br> Tamaño min de 3 y un máx de 10 carateres',
                //solo mayus
                mayus: function(val, field) {
                if (!/^[0-9A-Z]{1,5}$/.test(val)) {
                return  false;
                }
                return true;
                },
                mayusText: 'Solo carateres Mayusculas',
                //Para datos combos vehiculos y personas 

                alphanum0: function(val, field) {
                if (!/^[0-9A-Za-záéíóúñ\s*]{3,80}$/.test(val)) {
                return  false;
                }
                return true;
                },
                alphanum0Text: 'Solo carateres alfa numéricos',
                alphanum1: function(val, field) {
                if (!/^[0-9.A-Z.a-záéíóúñ\s*]{3,30}$/.test(val)) {
                return  false;
                }
                return true;
                },
                alphanum1Text: 'Solo carateres alfa numéricos',
                //para puntos
                puntos: function(val, field) {
                if (!/^[0-9.A-Z.a-záéíóúñ/\s*]{2,45}$/.test(val)) {
                return  false;
                }
                return true;
                },
                puntosText: 'Solo datos numéricos,mínimo 2 y máximo de 4 numeros',
                ///para rutas
                alphanum2: function(val, field) {
                if (!/^[0-9\s.A-Z.\sa-záéíóúñ.()-:\s*]{3,100}$/.test(val)) {
                return  false;
                }
                return true;
                },
                alphanum2Text: 'Solo carateres alfa numéricos',
                //para geocercas
                geo: function(val, field) {
                if (!/^[0-9]{2,4}$/.test(val)) {
                return  false;
                }
                return true;
                },
                geoText: 'Solo carateres numéricos mínimo 2 y máximo 4 numeros',
                num1: function(val, field) {
                if (!/^[0-9]{3,4}$/.test(val)) {
                return  false;
                }
                return true;
                },
                num1Text: 'Solo carateres numéricos',
                camposRegMun: function(val, field) {
                if (!/^[-0-9A-Za-z]{3,10}$/.test(val)) {
                return  false;
                }
                return true;
                },
                camposRegMunText: 'Solo carateres alfa numéricos,y guiones <br> Tamaño min de 5 y un máx de 10 carateres'


        });
                Ext.tip.QuickTipManager.init();
                menuCoop = Ext.create('Ext.menu.Menu', {
                items: [],
                        listeners: {
                        click: function(menu, item, e, eOpts) {
                        for (var i = 0; i < showCoopMap.length; i++) {
                        if (showCoopMap[i][0] === item.getItemId()) {
                        showCoopMap[i][2] = item.checked;
                                if (!item.checked) {
                        var form = Ext.create('Ext.form.Panel');
                                form.getForm().submit({
                        url: 'php/gui/draw/getLastGps.php',
                                params: {
                                listCoop: showCoopMap[i][0]
                                },
                                failure: function(form, action) {
                                Ext.example.msg('Mensaje', action.result.message);
                                },
                                success: function(form, action) {
                                if (connectionMap()) {
                                clearVehicles(action.result.data);
                                }
                                }
                        });
                        }
                        }
                        }
                        }
                        }
                });
                menuRoute = Ext.create('Ext.menu.Menu', {
                items: [],
                        listeners: {
                        click: function(menu, item, e, eOpts) {
                        if (item.checked) {
                        var idRoute = item.getItemId();
                                var form = Ext.create('Ext.form.Panel');
                                form.getForm().submit({
                        url: 'php/gui/draw/getRoute.php',
                                params: {
                                idRoute: idRoute
                                },
                                failure: function(form, action) {
                                Ext.MessageBox.show({
                                title: 'Información.',
                                        msg: action.result.message,
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.INFO
                                });
                                },
                                success: function(form, action) {
                                var resultado = action.result;
                                        if (connectionMap()) {
                                drawLineRoute(resultado.dataLine, idRoute);
                                        drawPointsRoute(resultado.dataPoint, idRoute);
                                }
                                }
                        });
                        } else {
                        if (connectionMap()) {
                        clearLienzoRouteByItems(item);
                        }
                        }
                        }
                        }
                });
                var administracion = Ext.create('Ext.button.Button', {
                text: 'Administración',
                        iconCls: 'icon-admin',
                        menu: [
                        {text: 'Empresas', iconCls: 'icon-company', handler: showWinAdminCompany},
                        {text: 'Personal', iconCls: 'icon-person', handler: showWinAdminPerson},
                        {text: 'Usuarios', iconCls: 'icon-user', handler: showWinAdminUser},
                        {text: 'Equipos', iconCls: 'icon-device', menu: [{
                        text: 'Administración',
                                iconCls: 'icon-admin',
                                handler: showWinAdminDevice
                        }, {
                        text: 'Enviar Cmd',
                                iconCls: 'icon-cmd',
                                handler: ventComands
                        }, {
                        text: 'Cmd Enviados',
                                iconCls: 'icon-cmd-hist',
                                handler: function() {
                                ventanaCmdHistorial();
                                }
                        }
                        ]
                        },
                        {text: 'Equipos Recaudo', icon: 'img/sd.ico', handler: ventAddEquipo},
                        {text: 'Buses', iconCls: 'icon-bus', handler: showWinAdminVehicle},
                        {text: 'Rutas', iconCls: 'icon-by-destination', handler: showWinAdminRoute},
                        {text: 'Puntos de Control', iconCls: 'icon-tree-point-control', handler: showWinAdminPoint},
                        {text: 'Puntos en Rutas', iconCls: 'icon-route', handler: showAdminPointRoute}, '-',
                        {text: 'Itinerarios', iconCls: 'icon-itinerary', menu: [{
                        text: 'Único', iconCls: 'icon-itinerary', handler: showWinAdminItiner
                        }, {
                        text: 'Múltiple', iconCls: 'icon-itinerary', handler: showWinAdminItinerSecond
                        }

                        ]
                        },
                        {text: 'Envío de Mail', iconCls: 'icon-email', handler: showWinSendMail}
                        ]
                });
                var monitoreo = Ext.create('Ext.button.Button', {
                text: 'Monitoreo',
                        iconCls: 'icon-monitoreo',
                        scope: this,
                        handler: function() {
                        //window.location = 'monitorTeam.php';
                        window.open('monitor_admin.php');
                        }
                });
                var estadistica = Ext.create('Ext.button.Button', {
                text: 'Estadística',
                        iconCls: 'icon-estadistica',
                        scope: this,
                        handler: function() {
                        //window.location = 'monitorTeam.php';
                        window.open('estadistica.php');
                        }
                });
                var btnHelp = Ext.create('Ext.button.Button', {
                text: 'Ayuda',
                        iconCls: 'icon-help',
                        menu: [{
                        text: 'Acerca de K-Bus',
                                iconCls: 'icon-about',
                                handler: function() {
                                showWinAbout();
                                        spot.show('panel-about');
                                }
                        }, {
                        text: 'Manual de Usuario',
                                iconCls: 'icon-manual-user',
                                handler: function() {
                                Ext.create('Ext.window.Window', {
                                title: 'Manual de Usuario',
                                        iconCls: 'icon-manual-user',
                                        height: 500,
                                        width: 800, items: [{
                                        xtype: 'component',
                                                autoEl: {
                                                tag: 'iframe',
                                                        style: 'height: 100%; width: 100%',
                                                        src: 'manual/manual.pdf'
                                                }
                                        }]
                                }).show();
                                }
                        }]
                });
                var salir = Ext.create('Ext.button.Button', {
                text: 'Salir',
                        iconCls: 'icon-log-out',
                        handler: function() {
                        window.location = 'php/login/logout.php';
                        }
                });
                var barraMenu = Ext.create('Ext.toolbar.Toolbar', {
                width: '100%',
                        items: [{
                        text: 'Menú',
                                iconCls: 'icon-menu',
                                menu: [{
                                text: 'Despachos',
                                        iconCls: 'icon-despachos',
                                        menu: [
                                        {text: 'Por Cooperativa', iconCls: 'icon-company', handler: showWinDisByCompany},
                                        {text: 'Por Bus', iconCls: 'icon-bus', handler: showWinDisByVeh},
                                        {text: 'Por Ruta', iconCls: 'icon-by-destination', handler: showWinDisByRoute},
                                        {text: 'Por Despachador', iconCls: 'icon-dispatcher', handler: showWinByDispatcher}
                                        ]
                                }, {
                                text: 'Posibles Despachos',
                                        iconCls: 'icon-pos-dispatch',
                                        menu: [
                                        {text: 'Por Bus', iconCls: 'icon-bus', handler: showWinPosDisByVehicle},
                                        {text: 'Por Ruta', iconCls: 'icon-by-destination', handler: showWinPosDisByRoute}
                                        ]
                                }, {
                                text: 'Reportes',
                                        iconCls: 'icon-reportes',
                                        menu: [
                                        {text: 'Recorrido', iconCls: 'icon-general', handler: showWinReportGeneral},
                                        {text: 'Manual', iconCls: 'icon-time-manual', handler: showWinManual},
                                        {text: 'Accesos Diarios', iconCls: 'icon-acceso', handler: showWinAccesDaily},
                                        {text: 'Excesos de Velocidad', iconCls: 'icon-reset', menu: [
                                        {text: 'Totales', iconCls: 'icon-reset', handler: showWinExcesosDaily},
                                        {text: 'Detallado', iconCls: 'icon-reset', handler: showWinExcesosDetallados}
                                        ]},
                                        {text: 'Datos Inválidos', iconCls: 'icon-feed-error', handler: showWinDatosInvalidos},
                                        ]
                                }, '-', {
                                text: 'Papeletas', iconCls: 'icon-papeletas', handler: function() {
                                window.open('papeletas.php');
                                }
                                }, {
                                text: 'Alarmas', iconCls: 'icon-reset', handler: function() {
                                window.open('alarmas.php');
                                }
                                }
                                ]
                        }, {
                        text: 'Caja Comun - Recaudo',
                                icon: 'img/icon_caja_comun.png',
                                menu: [
                                {
                                text: 'Consultas',
                                        icon: 'img/page_find.png',
                                        menu: [
//                            {text: 'Ultima transaccion', icon: 'img/search.bmp', handler: function() {
//                                    ventUltimaTran();
//                                }},
                                        {text: 'Pasajeros a bordo', icon: 'img/pasajeros.ico', handler: function() {
                                        ventPasajeros();
                                        }},
//                            {text: 'Equipos', icon: 'img/sd.ico', handler: function() {
//                                    ventanadeEquipos();
//                                }},
                                        {text: 'Busqueda de Equipos', icon: 'img/search2.bmp', handler: function() {
                                        ventEquiposta();
                                        }},
                                        {text: 'Saldo de tarjetas', icon: 'img/CardP.ico', handler: function() {
                                        ventCreditosTarjetas();
                                        }}
                                        ]
                                }, {
                                text: 'Reportes',
                                        icon: 'img/repo.png',
                                        menu: [
                                        {text: 'Tarjetas', icon: 'img/vcard.png', handler: function() {
                                        ventRepTarjetas();
                                        }},
                                        {text: 'BlackList', icon: 'img/blacklist.png', handler: function() {
                                        ventBlackList();
                                        }},
                                        {text: 'Transacciones', icon: 'img/transa.bmp', handler: function() {
                                        ventUltrans();
                                        }},
                                        {text: 'Recaudo', icon: 'img/recaudo.bmp', handler: function() {
                                        ventRecaudo();
                                        }},
                                        {text: 'Reporte de operadores',
                                                icon: 'img/ope.jpg',
                                                menu: [
                                                {text: 'Operadores Habilitados', icon: 'img/op.bmp', handler: function() {
                                                cargarChoferesHabilitados();
                                                }},
                                                {text: 'Registro de labores', icon: 'img/last_report.png', handler: function() {
                                                ventregistroOpns();
                                                }}
                                                ]
                                        },
                                        {text: 'Reporte de equipos', icon: 'img/sd.ico', handler: function() {
                                        cargarRepEquipos();
                                        }},
                                        {text: 'Pasajes Vendidos', icon: 'img/pasaj.bmp', handler: function() {
                                        ventPorRecarga();
                                        }},
//                            {text: 'Ver Ultima Transaccion', icon: 'img/find.png', handler: function() {
//                                    ventUltimaTran()
//                                }},
//                            {text: 'Ultimas Transacciones', icon: 'img/find.png', handler: function() {
//                                    ventUltrans();
//                                }},
                                        {text: 'Ejecutivo', icon: 'img/last_report.png',
                                                menu: [
                                                {text: 'Buses', iconCls: 'icon-bus', handler: function() {
                                                ventReporteEjecutivo();
                                                }},
                                                {text: 'Ruta', icon: 'img/last_report.png', handler: function() {

                                                }},
                                                {text: 'Paradas/Punto de Venta', icon: 'img/pv.bmp', handler: function() {

                                                }}
                                                ]
                                        }

//                            {text: 'Equipos', icon: 'img/find.png', handler: function() {
//                                    ventEquipost();
//                            }},
//                            {text: 'Pasajeros Transportados', icon: 'img/find.png', handler: function() {
//                                    ventPorPasajeros();
//                            }},
//                            {text: 'Vendidos vs Pagados', icon: 'img/find.png', handler: function() {
//                                    ventPorVp();
//                            }}
                                        ]
                                }, {
                                text: 'Reportes-Masivos',
                                        iconCls: 'icon-reportes',
                                        handler: function() {
                                        window.open('index_admin_masivos.php');
                                        }
                                }, {
                                text: 'Estadistica',
                                        icon: 'img/icon_estadistica.png',
                                        menu: [
                                        {text: 'Lista Negra', icon: 'img/establacklist.png', handler: function() {
                                        cargarEstadisticaBlackList();
                                        }},
                                        {text: 'Transacciones Diarias', icon: 'img/transaccion.png', handler: function() {
                                        cargarEstadisticaTrans();
                                        }},
                                        {text: 'Contador de personas', iconCls: 'icon-pasajeros', handler: function() {
                                        cargarEstadisticaConta();
                                        }},
                                        {text: 'Alarmas Contador', icon: 'img/alarmas.ico', handler: function() {
                                        cargarEstadisticAlarma();
                                        }},
                                        {text: 'Pasajes Vendidos Vs Utilizados', icon: 'img/vendidos.bmp', handler: function() {
                                        cargarEstadisticaPasajes();
                                        }}
                                        ]
                                }, {
                                text: 'Administración',
                                        iconCls: 'icon-admin',
                                        menu: [
                                        {text: 'Añadir Tarjetas Cliente', icon: 'img/vcard.png', handler: function() {
                                        ventAddTarjeta();
                                        }},
                                        {text: 'Añadir a Lista Negra', icon: 'img/addlist.png', handler: function() {
                                        ventAddBlackList();
                                        }},
                                        {text: 'Clientes', iconCls: 'icon-user', handler: function() {
                                        ventAddCliente();
                                        }},
                                        {text: 'Puntos de Venta', icon: 'img/pv.bmp', handler: function() {
                                        ventAddPunto();
                                        }}

                                        ]
                                }, '-', {
                                text: 'Contador de Pasajeros',
                                        iconCls: 'icon-contador',
                                        menu: [
                                        {text: 'Cantidad de Pasajeros', iconCls: 'icon-pasajeros', handler: ventCountPassangers},
                                        {text: 'Alarmas', iconCls: 'icon-alarmas-contador', handler: ventCountAlarms}
                                        ]
                                }
                                        
                                        
                                        
                                        
                                         ]
                        },
                                monitoreo, estadistica, {
                                text: "Herramientas",
                                        iconCls: "icon-herramientas",
                                        menu: [
                                        {text: 'Despachar', iconCls: 'icon-dispatch', handler: showWinDispath},
                                        {text: 'Despachar por Itinerario', iconCls: 'icon-itinerary', menu: [{
                                        text: 'Único', iconCls: 'icon-itinerary', handler: showWinDispathByItinerary
                                        }, {
                                        text: 'Múltiple', iconCls: 'icon-itinerary', handler: showWinDispathByItinerary_second
                                        }
                                        ]
                                        }
                                        ]
                                },
                                administracion,
                                btnHelp, '->',
                                salir, {
                                xtype: 'image',
                                        src: getNavigator(),
                                        width: 16,
                                        height: 16,
                                        margin: '0 5 0 0'
                                }, {
                        xtype: 'label',
                                html: '<iframe src="http://free.timeanddate.com/clock/i3x5kb7x/n190/tlec4/fn12/fs18/tct/pct/ftb/bas0/bat0/th1" frameborder="0"   width= "100" height="15" allowTransparency="true"></iframe>'
                        }
                        ]
                });
                var panelMenu = Ext.create('Ext.form.Panel', {
                region: 'north',
                        deferreRender: false,
                        activeTab: 0,
                        items: [{
                        layout: 'hbox',
                                bodyStyle: {
                                background: '#add2ed'
                                },
                                items: [{
                                xtype: 'label',
                                        html: '<a href="http://www.kradac.com" target="_blank"><img src="img/logo_kbus.png" width="250" height="64"></a>'
                                }, {
                                xtype: 'label',
                                        padding: '15 0 0 0',
                                        style: {
                                        color: '#157fcc'
                                        },
                                        html: '<section id="panelNorte">' +
                                        '<center><strong id="titulo">Sistema de Monitoreo de Transporte Urbano</strong></center>' +
                                        '<strong id="subtitulo">Bienvenid@ al Sistema: ' + personKBus + '</strong>' +
                                        '</section>'
                                }]
                        },
                                barraMenu]
                });
                var panelEste = Ext.create('Ext.form.Panel', {
                region: 'west',
                        id: 'west_panel',
                        title: 'Facetas K-Bus',
                        iconCls: 'icon-facetas',
                        frame: true,
                        width: 220,
                        height: 10,
                        split: true,
                        collapsible: true,
                        layout: 'accordion',
                        border: false,
                        layoutConfig: {
                        animate: false
                        },
                        items: [{
                        xtype: 'treepanel',
                                id: 'buses-tree',
                                rootVisible: false,
                                title: 'Cooperativas',
                                autoScroll: true,
                                iconCls: 'icon-tree-company',
                                store: storeTreeBuses,
                                tools: [{
                                type: 'refresh',
                                        itemId: 'refresh_buses',
                                        tooltip: 'Refresh form Data',
                                        hidden: true,
                                        handler: function() {
                                        var tree = Ext.getCmp('buses-tree');
                                                tree.body.mask('Loading', 'x-mask-loading');
                                                /*storeTreeBuses.reload(function(){
                                                 tree.body.unmask();
                                                 Ext.example.msg('Buses', 'Recargado');
                                                 });*/
                                                storeTreeBuses.reload();
                                                Ext.example.msg('Buses', 'Recargado');
                                                tree.body.unmask();
                                        }
                                }],
                                root: {
                                dataIndex: 'text',
                                        expanded: true
                                },
                                listeners: {
                                itemclick: function(thisObject, record, item, index, e, eOpts) {
                                if (connectionMap()) {
                                var id = record.id;
                                        if (id.indexOf('_') !== - 1) {
                                var aux = record.id.split('_');
                                        var idCompany = parseInt(aux[0]);
                                        var idVehicle = 'last' + aux[1];
                                        buscarEnMapa(idCompany, idVehicle);
                                        tabPanelReports.setActiveTab(0);
                                }
                                ;
                                }
                                }
                                }
                        }, {
                        xtype: 'treepanel',
                                id: 'puntos-tree',
                                title: 'Puntos de control',
                                autoScroll: true,
                                iconCls: 'icon-tree-point-control',
                                store: storeTreePoints,
                                rootVisible: false,
                                tools: [{
                                type: 'refresh',
                                        itemId: 'refresh_puntos',
                                        tooltip: 'Refresh form Data',
                                        hidden: true,
                                        handler: function() {
                                        var tree = Ext.getCmp('puntos-tree');
                                                tree.body.mask('Loading', 'x-mask-loading');
                                                /*storeTreeBuses.reload(function(){
                                                 tree.body.unmask();
                                                 Ext.example.msg('Buses', 'Recargado');
                                                 });*/
                                                storePuntos.reload();
                                                Ext.example.msg('Buses', 'Recargado');
                                                tree.body.unmask();
                                        }
                                }],
                                root: {
                                dataIndex: 'text',
                                        expanded: true
                                },
                                listeners: {
                                itemclick: function(thisObject, record, item, index, e, eOpts) {
                                if (connectionMap()) {
                                var aux = record.id;
                                        if (aux.indexOf('ext-record') === - 1) {
                                var idPointMap = record.data.id;
                                        lienzoPoints(idPointMap);
                                }
                                }
                                }
                                }
                        }]
                });
                Ext.define("direcciones", {
                extend: 'Ext.data.Model',
                        proxy: {
                        type: 'ajax',
                                url: 'php/extra/getDirecciones.php',
                                reader: {
                                type: 'json',
                                        root: 'direccion'
                                }
                        },
                        fields: [
                        {name: 'todo'},
                        {name: 'pais'},
                        {name: 'ciudad'},
                        {name: 'barrio'},
                        {name: 'avenidaP'},
                        {name: 'avenidaS'},
                        {name: 'latitud'},
                        {name: 'longitud'}
                        ]
                });
                var storeDirecciones = Ext.create('Ext.data.Store', {
                pageSize: 10,
                        model: 'direcciones'
                });
                var toolbarMap = Ext.create('Ext.toolbar.Toolbar', {
                region: 'north',
                        border: true,
                        items: [{
                        xtype: 'combo',
                                width: '75%',
                                store: storeDirecciones,
                                fieldLabel: '<b>Dirección</b>',
                                displayField: 'todo',
                                typeAhead: false,
                                hideTrigger: true,
                                emptyText: 'Ciudad,Barrio,Avenida Principal,Avenida Secundaria',
                                listConfig: {
                                loadingText: 'Buscando...',
                                        emptyText: 'No ha encontrado resultados parecidos.',
                                        // Custom rendering template for each item
                                        getInnerTpl: function() {
                                        return '<b>{pais} , {ciudad}:</b><br>{barrio} , {avenidaP} , {avenidaS}';
                                        }
                                },
                                listeners: {
                                select: function(thisObject, record, eOpts) {
                                var longitud = record[0].data.longitud;
                                        var latitud = record[0].data.latitud;
                                        var zoom = 18;
                                        localizarDireccion(longitud, latitud, zoom);
                                }
                                },
                                pageSize: 10
                        }, '->', {
                        iconCls: 'icon-localizame',
                                tooltip: 'Ubicar mi Posición',
                                handler: function() {
                                getLocation();
                                        tabPanelReports.setActiveTab(0);
                                }
                        }, {
                        iconCls: 'icon-clear-map',
                                tooltip: 'Limpiar Mapa',
                                handler: function() {
                                clearMap();
                                }
                        }, {
                        xtype: 'splitbutton',
                                text: 'Cooperativas',
                                iconCls: 'icon-company',
                                menu: menuCoop,
                                handler: function() {
                                this.showMenu();
                                }
                        }, {
                        xtype: 'splitbutton',
                                text: 'Rutas',
                                iconCls: 'icon-by-destination',
                                menu: menuRoute,
                                handler: function() {
                                this.showMenu();
                                }
                        }]
                });
                tabPanelReports = Ext.create('Ext.tab.Panel', {
                region: 'center',
                        frame: true,
                        deferreRender: false,
                        activeTab: 0,
                        items: [{
                        id: 'panel-map',
                                layout: 'border',
                                title: 'Mapa',
                                iconCls: 'icon-map',
                                html: '<div id="map"></div>'
                        }]
                });
                var panelCentral = Ext.create('Ext.form.Panel', {
                region: 'center',
                        layout: 'border',
                        items: [
                                toolbarMap,
                                tabPanelReports
                        ]
                });
                Ext.create('Ext.container.Viewport', {
                layout: 'border',
                        items: [panelMenu, panelEste, panelCentral]
                });
                storeCompany.load();
                storeRoute.load();
//                window.open('monitor_admin.php');
                loadMap();
        
        });
 