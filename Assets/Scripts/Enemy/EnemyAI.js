#pragma strict

public var patrolSpeed : float = 2f;                        // The nav mesh agent's speed when patrolling.
public var chaseSpeed : float = 5f;                         // The nav mesh agent's speed when chasing.
public var chaseWaitTime : float = 5f;                      // The amount of time to wait when the last sighting is reached.
public var patrolWaitTime : float = 1f;                     // The amount of time to wait when the patrol way point is reached.
public var patrolWayPoints : Transform[];                   // An array of transforms for the patrol route.


private var enemySight : EnemySight;                        // Reference to the EnemySight script.
private var nav : NavMeshAgent;                             // Reference to the nav mesh agent.
private var player : Transform;                             // Reference to the player's transform.
private var playerHealth : PlayerHealth;                    // Reference to the PlayerHealth script.
private var lastPlayerSighting : LastPlayerSighting;        // Reference to the last global sighting of the player.
private var chaseTimer : float;                             // A timer for the chaseWaitTime.
private var patrolTimer : float;                            // A timer for the patrolWaitTime.
private var wayPointIndex : int;                            // A counter for the way point array.


function Awake ()
{
    // Setting up the references.
    enemySight = GetComponent(EnemySight);
    nav = GetComponent(NavMeshAgent);
    player = GameObject.FindGameObjectWithTag(Tags.player).transform;
    playerHealth = player.GetComponent(PlayerHealth);
    lastPlayerSighting = GameObject.FindGameObjectWithTag(Tags.gameController).GetComponent(LastPlayerSighting);
}


function Update ()
{
    // If the player is in sight and is alive...
    if(enemySight.playerInSight && playerHealth.health > 0f)
        // ... shoot.
        Shooting();

    // If the player has been sighted and isn't dead...
    else if(enemySight.personalLastSighting != lastPlayerSighting.resetPosition && playerHealth.health > 0f)
        // ... chase.
        Chasing();

    // Otherwise...
    else
        // ... patrol.
        Patrolling();
}


function Shooting ()
{
    // Stop the enemy where it is.
    nav.Stop();
}


function Chasing ()
{
    // Create a vector from the enemy to the last sighting of the player.
    var sightingDeltaPos : Vector3 = enemySight.personalLastSighting - transform.position;

    // If the the last personal sighting of the player is not close...
    if(sightingDeltaPos.sqrMagnitude > 4f)
        // ... set the destination for the NavMeshAgent to the last personal sighting of the player.
        nav.destination = enemySight.personalLastSighting;

    // Set the appropriate speed for the NavMeshAgent.
    nav.speed = chaseSpeed;

    // If near the last personal sighting...
    if(nav.remainingDistance < nav.stoppingDistance)
    {
        // ... increment the timer.
        chaseTimer += Time.deltaTime;

        // If the timer exceeds the wait time...
        if(chaseTimer >= chaseWaitTime)
        {
            // ... reset last global sighting, the last personal sighting and the timer.
            lastPlayerSighting.position = lastPlayerSighting.resetPosition;
            enemySight.personalLastSighting = lastPlayerSighting.resetPosition;
            chaseTimer = 0f;
        }
    }
    else
        // If not near the last sighting personal sighting of the player, reset the timer.
        chaseTimer = 0f;
}


function Patrolling ()
{
    // Set an appropriate speed for the NavMeshAgent.
    nav.speed = patrolSpeed;

    // If near the next waypoint or there is no destination...
    if(nav.destination == lastPlayerSighting.resetPosition || nav.remainingDistance < nav.stoppingDistance)
    {
        // ... increment the timer.
        patrolTimer += Time.deltaTime;

        // If the timer exceeds the wait time...
        if(patrolTimer >= patrolWaitTime)
        {
            // ... increment the wayPointIndex.
            if(wayPointIndex == patrolWayPoints.Length - 1)
                wayPointIndex = 0;
            else
                wayPointIndex++;

            // Reset the timer.
            patrolTimer = 0;
        }
    }
    else
        // If not near a destination, reset the timer.
        patrolTimer = 0;

    // Set the destination to the patrolWayPoint.
    nav.destination = patrolWayPoints[wayPointIndex].position;
}