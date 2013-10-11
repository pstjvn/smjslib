// This file was autogenerated by ../../library/closure/bin/build/depswriter.py.
// Please do not edit.
goog.addDependency('../../../apps/smjs/controls/dialogs.js', ['smstb.control.dialogs'], ['smstb.tv.ErrorDialog']);
goog.addDependency('../../../apps/smjs/ds/epg.js', ['smstb.ds.Epg.Cache', 'smstb.ds.Epg.Property'], ['pstj.ds.Cache']);
goog.addDependency('../../../apps/smjs/ds/list.js', ['smstb.ds.List', 'smstb.ds.Loader'], ['goog.array', 'goog.asserts', 'goog.object', 'pstj.ds.List', 'smstb.ds.Record', 'smstb.transport.Transport']);
goog.addDependency('../../../apps/smjs/ds/record.js', ['smstb.ds.Record'], ['pstj.ds.ListItem']);
goog.addDependency('../../../apps/smjs/persistence/lang-cat.js', ['smstb.persistence.categories', 'smstb.persistence.languages'], ['smstb.persistence.List']);
goog.addDependency('../../../apps/smjs/persistence/list.js', ['smstb.persistence.List'], ['goog.async.Delay', 'smstb.persistence.Storage']);
goog.addDependency('../../../apps/smjs/persistence/storage.js', ['smstb.persistence.Storage'], ['goog.storage.Storage', 'goog.storage.mechanism.mechanismfactory']);
goog.addDependency('../../../apps/smjs/persistence/typedlist.js', ['smstb.persistence.TypedList'], ['smstb.persistence.Storage']);
goog.addDependency('../../../apps/smjs/player/iplayer.js', ['smstb.player.IPlayer'], []);
goog.addDependency('../../../apps/smjs/player/player.js', ['smstb.player.Player', 'smstb.player.Player.EventType', 'smstb.player.Player.QueryEvent'], ['goog.asserts', 'goog.events', 'goog.events.Event', 'goog.events.EventHandler', 'goog.events.EventTarget', 'smstb.player.EventType', 'smstb.player.IPlayer', 'smstb.player.SMJSPlayer']);
goog.addDependency('../../../apps/smjs/player/playerconfig.js', ['smstb.player.config'], ['pstj.ds.List', 'smstb.template']);
goog.addDependency('../../../apps/smjs/player/playerevent.js', ['smstb.player.EventType', 'smstb.player.State'], ['goog.events']);
goog.addDependency('../../../apps/smjs/player/smjsplayer.js', ['smstb.player.SMJSPlayer', 'smstb.player.SMJSPlayer.InfoEvent'], ['goog.events.Event', 'goog.events.EventHandler', 'goog.events.EventTarget', 'smstb.Remote', 'smstb.ds.Record', 'smstb.player.EventType', 'smstb.player.IPlayer', 'smstb.player.State', 'smstb.serverconfig.Section', 'smstb.serverconfig.Section.EventType', 'smstb.transport.smjs.pubsub', 'smstb.transport.smjspackage.Base']);
goog.addDependency('../../../apps/smjs/remotecontrol/remote.js', ['smstb.Remote', 'smstb.Remote.Event', 'smstb.Remote.EventType', 'smstb.Remote.Keys'], ['goog.array', 'goog.events', 'goog.events.Event', 'goog.events.EventTarget', 'goog.events.KeyCodes', 'goog.events.KeyEvent', 'goog.events.KeyHandler', 'goog.events.KeyHandler.EventType', 'smstb.transport.smjs.pubsub']);
goog.addDependency('../../../apps/smjs/transport/configuration.js', ['smstb.transport.config'], []);
goog.addDependency('../../../apps/smjs/transport/jsonp/query.js', ['smstb.transport.jsonp.Query'], ['goog.Disposable', 'goog.array', 'goog.net.Jsonp', 'smstb.transport.jsonp.Response', 'smstb.transport.xhr.Query']);
goog.addDependency('../../../apps/smjs/transport/jsonp/response.js', ['smstb.transport.jsonp.Response'], ['smstb.transport.xhr.Response']);
goog.addDependency('../../../apps/smjs/transport/query.js', ['smstb.transport.Query'], []);
goog.addDependency('../../../apps/smjs/transport/resources.js', ['smstb.transport.Resource'], []);
goog.addDependency('../../../apps/smjs/transport/response.js', ['smstb.transport.Response'], []);
goog.addDependency('../../../apps/smjs/transport/smjs/dispatcher.js', ['smstb.transport.smjs.Dispatcher'], ['smstb.transport.smjs.Response', 'smstb.transport.smjs.pubsub']);
goog.addDependency('../../../apps/smjs/transport/smjs/package/base.js', ['smstb.transport.smjspackage.Base'], ['goog.Disposable', 'goog.json', 'smstb.transport.smjs.Dispatcher', 'smstb.transport.smjspackage.Request', 'smstb.vendor.Smjs']);
goog.addDependency('../../../apps/smjs/transport/smjs/package/header.js', ['smstb.transport.smjspackage.Header'], ['pstj.math.utils']);
goog.addDependency('../../../apps/smjs/transport/smjs/package/request.js', ['smstb.transport.smjspackage.Request'], ['smstb.transport.smjspackage.Header']);
goog.addDependency('../../../apps/smjs/transport/smjs/pubsubchannel.js', ['smstb.transport.smjs.pubsub'], ['goog.pubsub.PubSub']);
goog.addDependency('../../../apps/smjs/transport/smjs/query.js', ['smstb.transport.smjs.Query'], ['goog.Disposable', 'smstb.transport.Query', 'smstb.transport.smjspackage.Base']);
goog.addDependency('../../../apps/smjs/transport/smjs/response.js', ['smstb.transport.smjs.Response'], ['goog.Disposable', 'goog.asserts', 'goog.json', 'smstb.transport.Response']);
goog.addDependency('../../../apps/smjs/transport/smjs/serverconfig/serverconfig.js', ['smstb.serverconfig.Section', 'smstb.serverconfig.Section.EventType'], ['goog.events', 'goog.events.Event', 'goog.events.EventTarget', 'goog.object', 'smstb.transport.smjspackage.Base']);
goog.addDependency('../../../apps/smjs/transport/smjs/vendor/smjs.js', ['smstb.vendor.Smjs'], ['smstb.transport.smjs.Dispatcher', 'smstb.vendor.ESmjs']);
goog.addDependency('../../../apps/smjs/transport/smjs/vendor/smjsemulation.js', ['smstb.vendor.ESmjs'], ['goog.array', 'goog.events.EventHandler', 'goog.json', 'goog.net.WebSocket', 'goog.net.WebSocket.EventType', 'goog.string', 'pstj.configure', 'smstb.transport.smjs.Dispatcher']);
goog.addDependency('../../../apps/smjs/transport/transport.js', ['smstb.transport.Transport', 'smstb.transport.Transport.Type'], ['pstj.configure', 'smstb.transport.jsonp.Query', 'smstb.transport.smjs.Query', 'smstb.transport.xhr.Query']);
goog.addDependency('../../../apps/smjs/transport/xhr/query.js', ['smstb.transport.xhr.Query'], ['goog.Disposable', 'goog.asserts', 'goog.net.XhrIo', 'pstj.configure', 'smstb.persistence.categories', 'smstb.persistence.languages', 'smstb.transport.Query', 'smstb.transport.config', 'smstb.transport.xhr.Response']);
goog.addDependency('../../../apps/smjs/transport/xhr/response.js', ['smstb.transport.xhr.Response'], ['goog.Disposable', 'goog.array', 'goog.json', 'goog.json.NativeJsonProcessor', 'pstj.configure', 'smstb.transport.Response', 'smstb.transport.config']);
goog.addDependency('../../../apps/smjs/tv/bus.js', ['smstb.tv.Topic', 'smstb.tv.bus'], ['goog.pubsub.PubSub']);
goog.addDependency('../../../apps/smjs/tv/button.js', ['smstb.tv.Button'], ['smstb.Remote.Keys', 'smstb.tv.ButtonRenderer', 'smstb.tv.Component']);
goog.addDependency('../../../apps/smjs/tv/buttonrenderer.js', ['smstb.tv.ButtonRenderer'], ['smstb.tv.ComponentRenderer']);
goog.addDependency('../../../apps/smjs/tv/component.js', ['smstb.tv.Component', 'smstb.tv.Component.Event', 'smstb.tv.Component.EventType'], ['goog.dom.dataset', 'goog.events', 'goog.events.Event', 'goog.ui.Control', 'smstb.tv.ComponentRenderer', 'smstb.tv.Topic', 'smstb.tv.bus', 'smstb.tv.decorator']);
goog.addDependency('../../../apps/smjs/tv/componentrenderer.js', ['smstb.tv.ComponentRenderer'], ['pstj.ui.ControlRenderer']);
goog.addDependency('../../../apps/smjs/tv/container.js', ['smstb.tv.Container', 'smstb.tv.ContainerRenderer'], ['smstb.Remote.Keys', 'smstb.tv.Component', 'smstb.tv.Component.EventType', 'smstb.tv.ComponentRenderer', 'smstb.tv.decorator']);
goog.addDependency('../../../apps/smjs/tv/decorator.js', ['smstb.tv.decorator'], ['goog.array', 'goog.dom', 'goog.dom.classlist']);
goog.addDependency('../../../apps/smjs/tv/errordialog.js', ['smstb.tv.ErrorDialog'], ['goog.ui.ControlRenderer', 'smstb.tv.Button', 'smstb.tv.Container', 'smstb.tv.ContainerRenderer', 'smstb.tv.decorator']);
goog.addDependency('../../../apps/smjs/tv/inlinelist.js', ['smstb.tv.InlineList', 'smstb.tv.InlineListRenderer'], ['goog.dom', 'goog.events.EventType', 'pstj.ds.ListItem', 'pstj.ui.ngAgent', 'smstb.Remote.Keys', 'smstb.player.config', 'smstb.template', 'smstb.tv.Component', 'smstb.tv.ComponentRenderer', 'smstb.tv.decorator']);
goog.addDependency('../../../apps/smjs/tv/playdialog.js', ['smstb.tv.PlayerDialog'], ['goog.async.nextTick', 'goog.ui.ControlRenderer', 'smstb.player.config', 'smstb.tv.Button', 'smstb.tv.Container', 'smstb.tv.ContainerRenderer', 'smstb.tv.InlineList', 'smstb.tv.decorator']);
goog.addDependency('../../../apps/smjs/widgets/button-panel.js', ['smstb.widget.ButtonPanel'], ['goog.async.Delay', 'goog.dom.classlist', 'goog.dom.dataset', 'goog.events.EventType', 'goog.ui.Component', 'goog.ui.Component.EventType']);
goog.addDependency('../../../apps/smjs/widgets/imagerotator.js', ['smstb.widget.ImageRotator'], ['goog.array', 'goog.asserts', 'goog.async.Delay', 'goog.dom.classlist', 'pstj.configure', 'pstj.ds.Image', 'pstj.ds.ImageList', 'pstj.ds.ImageList.EventType', 'pstj.ui.Templated']);
goog.addDependency('../../../apps/smjs/widgets/listitem.js', ['smstb.widget.ListItem', 'smstb.widget.ListItem.Action', 'smstb.widget.ListItemRenderer'], ['goog.dom', 'goog.string', 'goog.ui.Component.State', 'goog.ui.Control', 'pstj.configure', 'pstj.ui.Button', 'pstj.ui.EmbededButtonRenderer', 'pstj.ui.ListItemRenderer', 'smstb.ds.Record', 'smstb.template']);
goog.addDependency('../../../apps/smjs/widgets/notification.js', ['smstb.widget.Notification'], ['goog.async.Delay', 'goog.dom.classlist', 'goog.events.EventType', 'goog.ui.Component', 'pstj.ds.ListItem', 'pstj.ui.ngAgent']);
goog.addDependency('../../../apps/smjs/widgets/nsrecorditem.js', ['smstb.widget.NSRecordItem'], ['goog.dom.classlist', 'goog.dom.dataset', 'pstj.configure', 'pstj.ui.TableViewItem']);
goog.addDependency('../../../apps/smjs/widgets/nsrecordview.js', ['smstb.widget.NSRecordView'], ['pstj.lab.style.css', 'pstj.ui.TableView', 'smstb.widget.NSRecordItem', 'smstb.widget.RecordRenderer']);
goog.addDependency('../../../apps/smjs/widgets/pager.js', ['smstb.widget.Pager'], ['goog.dom.classlist', 'pstj.widget.Pager']);
goog.addDependency('../../../apps/smjs/widgets/payment-confirmation-template.js', ['smstb.widget.PaymentConfirmationTemplate'], ['pstj.ui.Template', 'smstb.template']);
goog.addDependency('../../../apps/smjs/widgets/players/androidplayer.js', ['smstb.widget.AndroidPlayer'], ['goog.string', 'goog.ui.Component']);
goog.addDependency('../../../apps/smjs/widgets/players/flashplayer.js', ['smstb.widget.FlashPlayer'], ['goog.dom', 'goog.ui.Component']);
goog.addDependency('../../../apps/smjs/widgets/players/tagplayer.js', ['smstb.widget.TagPlayer'], ['goog.ui.Component', 'smstb.player.EventType']);
goog.addDependency('../../../apps/smjs/widgets/players/tvplayer.js', ['smstb.widget.TVPlayer'], ['goog.ui.Component', 'goog.ui.Component.EventType', 'goog.ui.ControlRenderer', 'pstj.ui.Button', 'pstj.ui.CustomButtonRenderer', 'pstj.ui.ngAgent', 'smstb.ds.Record', 'smstb.player.EventType', 'smstb.widget.AndroidPlayer', 'smstb.widget.FlashPlayer', 'smstb.widget.TagPlayer']);
goog.addDependency('../../../apps/smjs/widgets/popover.js', ['smstb.widget.PopOver'], ['pstj.ui.PopOverLayer']);
goog.addDependency('../../../apps/smjs/widgets/popup.js', ['smstb.widget.MobilePopup'], ['goog.dom', 'goog.dom.classlist', 'pstj.ui.Button', 'pstj.ui.Templated', 'pstj.ui.ngAgent']);
goog.addDependency('../../../apps/smjs/widgets/radioselect.js', ['smstb.widget.RadioSelect'], ['goog.ui.Component', 'goog.ui.Component.EventType', 'goog.ui.ControlRenderer', 'pstj.ui.Button', 'pstj.ui.EmbededButtonRenderer']);
goog.addDependency('../../../apps/smjs/widgets/recordrenderer.js', ['smstb.widget.RecordRenderer'], ['pstj.ui.TableViewItemRenderer']);
goog.addDependency('../../../apps/smjs/widgets/search-panel.js', ['smstb.widget.SearchPanel'], ['goog.dom.classlist', 'goog.events.EventType', 'goog.string', 'goog.ui.Component', 'goog.ui.Component.EventType', 'goog.ui.Component.State', 'goog.ui.Control', 'pstj.ui.TouchAgent', 'smstb.widget.RadioSelect']);
