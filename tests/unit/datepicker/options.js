define( [
	"jquery",
	"ui/widgets/datepicker"
], function( $ ) {

module( "datepicker: options", {
	setup:  function() {
		this.element = $( "#datepicker" ).datepicker( { show: false, hide: false } );
		this.widget = this.element.datepicker( "widget" );
	},
	teardown: function() {
		this.element.datepicker( "destroy" ).val( "" );
	}
} );

test( "appendTo", function() {
	expect( 6 );

	var container = this.widget.parent()[ 0 ],
		detached = $( "<div>" );

	equal( container, document.body, "defaults to body" );
	this.element.datepicker( "destroy" );

	this.element.datepicker( { appendTo: "#qunit-fixture" } );
	container = this.element.datepicker( "widget" ).parent()[ 0 ];
	equal( container, $( "#qunit-fixture" )[ 0 ], "child of specified element" );
	this.element.datepicker( "destroy" );

	this.element.datepicker( { appendTo: "#does-not-exist" } );
	container = this.element.datepicker( "widget" ).parent()[ 0 ];
	equal( container, document.body, "set to body if element does not exist" );
	this.element.datepicker( "destroy" );

	this.element.datepicker()
		.datepicker( "option", "appendTo", "#qunit-fixture" );
	container = this.element.datepicker( "widget" ).parent()[ 0 ];
	equal( container, $( "#qunit-fixture" )[ 0 ], "modified after init" );
	this.element.datepicker( "destroy" );

	this.element.datepicker( { appendTo: detached } );
	container = this.element.datepicker( "widget" ).parent()[ 0 ];
	equal( container, detached[ 0 ], "detached jQuery object" );
	this.element.datepicker( "destroy" );

	this.element.datepicker( { appendTo: detached[ 0 ] } );
	container = this.element.datepicker( "widget" ).parent()[ 0 ];
	equal( container, detached[ 0 ], "detached DOM element" );
} );

test( "Pass-through options", function() {
	expect( 11 );

	var options = {
			buttons: { "Test": $.noop },
			dateFormat: { date: "full" },
			disabled: true,
			eachDay: function( day ) { day; },
			locale: "de",
			max: new Date( 2000, 0, 1 ),
			min: new Date( 2000, 0, 2 ),
			numberOfMonths: 3,
			showWeek: true
		},
		input = $( "<input>" ).val( "1/1/14" ).appendTo( "#qunit-fixture" ).datepicker(),
		instance = input.datepicker( "instance" );

	$.each( options, function( key, value ) {
		input.datepicker( "option", key, value );

		deepEqual(
			instance.calendar.calendar( "option", key ),
			value,
			"option " + key + ": correct value"
		);

		if ( key === "dateFormat" ) {
			equal( input.val(), "Wednesday, January 1, 2014", "option " + key + ": updated format" );
		}

		if ( key === "locale" ) {
			equal( input.val(), "Mittwoch, 1. Januar 2014", "option " + key + ": updated locale" );
		}
	} );
} );

asyncTest( "position", function( assert ) {
	expect( 3 );

	var input = $( "<input>" ).datepicker().appendTo( "body" ).css( {
			position: "absolute",
			top: 0,
			left: 0
		} ),
		container = input.datepicker( "widget" );

	input.datepicker( "open" );
	setTimeout( function() {
		assert.close( input.offset().left, container.offset().left, 1, "left sides line up by default" );
		assert.close( container.offset().top, input.offset().top + input.outerHeight(), 1,
			"datepicker directly under input by default" );

		// Change the position option using option()
		input.datepicker( "option", "position", {
			my: "left top",
			at: "right bottom"
		} );
		assert.close( container.offset().left, input.offset().left + input.outerWidth(), 1,
			"datepicker on right hand side of input after position change" );

		input.remove();
		start();
	} );
} );

test( "Stop datepicker from appearing with beforeOpen event handler - nothing", function() {
	expect( 1 );

	this.element.datepicker( {
		beforeOpen: function() {}
	} );

	this.element.datepicker( "open" );
	ok( this.element.datepicker( "widget" ).is( ":visible" ), "beforeOpen returns nothing" );
} );

test( "Stop datepicker from appearing with beforeOpen event handler - true", function() {
	expect( 1 );

	this.element.datepicker( {
		beforeOpen: function() {
			return true;
		}
	} );
	this.element.datepicker( "open" );
	ok( this.element.datepicker( "widget" ).is( ":visible" ), "beforeOpen returns true" );
} );

test( "Stop datepicker from appearing with beforeOpen event handler - false", function() {
	expect( 1 );

	this.element.datepicker( {
		beforeOpen: function() {
			return false;
		}
	} );
	this.element.datepicker( "open" );
	ok( !this.element.datepicker( "widget" ).is( ":visible" ), "beforeOpen returns false" );
} );

} );
