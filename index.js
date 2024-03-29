const TEAMS = [
    { Name: '', Logo: '', Colors: {}, Skaters: {} },
    { Name: '', Logo: '', Colors: {}, Skaters: {} },
];

const updateTeamSettings = ( { Team, Color, field }, value ) => {
    const teamIdx = Number( Team ) - 1;

    if ( field === 'Color' ) {

        TEAMS[ teamIdx ].Colors[ Color ] = value;
    } else {
        TEAMS[ teamIdx ][ field ] = value;
    }

    render();
};

const updateSkaterSettings = ( { Skater, Team, field }, value ) => {
    const teamIdx = Number( Team ) - 1;

    if ( ! TEAMS[ teamIdx ].Skaters.hasOwnProperty( Skater ) ) {
        TEAMS[ teamIdx ].Skaters[ Skater ] = {};
    }

    TEAMS[ teamIdx ].Skaters[ Skater ][ field ] = value;

    render();
};

const render = () => TEAMS.forEach( renderTeam );

const renderTeam = ( team, i ) => {
    const $team = $( `#team--${ i+1 }` );
    const skaters = Object.values( team.Skaters )
        .filter( ( { RosterNumber } ) => RosterNumber )
        .sort( ( a, b ) => a.RosterNumber && a.RosterNumber.localeCompare( b.RosterNumber ) );
    
   $( 'h2', $team ).html( team.Name ).css( {
       color: team.Colors.scoreboard_fg,
       textShadow: `1px 2px 2px ${ team.Colors.scoreboard_glow }`
   } );

   $( '.team__logo', $team ).css( {
       backgroundImage: `url('${ team.Logo }' )`
   } );

   $( 'ul', $team ).html('');

   skaters.forEach( 
       ( { Name, RosterNumber, Flags } ) => 
            $( `
                  <span class="skater__number">${ RosterNumber }</span>
                  <span class="skater__name">${ Name }</span>
                  <span class="skater__flags">${ Flags }</span>
                  `
             ).appendTo( $( 'ul', $team ) )
   );
};

const init = () => {

    WS.Register( [
        "ScoreBoard.Team(*).Name",
        "ScoreBoard.Team(*).Logo",
        "ScoreBoard.Team(*).Color(*)",
    ], updateTeamSettings );

    WS.Register( [
        "ScoreBoard.Team(*).Skater(*).Flags",
        "ScoreBoard.Team(*).Skater(*).Name",
        "ScoreBoard.Team(*).Skater(*).RosterNumber" 
    ], updateSkaterSettings );

    WS.Connect();
    WS.AutoRegister();
};

$(init);
