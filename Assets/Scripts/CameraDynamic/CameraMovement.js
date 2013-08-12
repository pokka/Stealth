#pragma strict

public var smooth : float = 1.5f;           // The relative speed at which the camera will catch up.


private var player : Transform;             // Reference to the player's transform.
private var relCameraPos : Vector3;         // The relative position of the camera from the player.
private var relCameraPosMag : float;        // The distance of the camera from the player.
private var newPos : Vector3;               // The position the camera is trying to reach.


function Awake ()
{
    // Setting up the reference.
    player = GameObject.FindGameObjectWithTag(Tags.player).transform;

    // Setting the relative position as the initial relative position of the camera in the scene.
    relCameraPos = transform.position - player.position;
    relCameraPosMag = relCameraPos.magnitude - 0.5f;
}


function FixedUpdate ()
{
    // The standard position of the camera is the relative position of the camera from the player.
    var standardPos : Vector3 = player.position + relCameraPos;

    // The abovePos is directly above the player at the same distance as the standard position.
    var abovePos : Vector3 = player.position + Vector3.up * relCameraPosMag;

    // An array of 5 points to check if the camera can see the player.
    var checkPoints : Vector3[] = new Vector3[5];

    // The first is the standard position of the camera.
    checkPoints[0] = standardPos;

    // The next three are 25%, 50% and 75% of the distance between the standard position and abovePos.
    checkPoints[1] = Vector3.Lerp(standardPos, abovePos, 0.25f);
    checkPoints[2] = Vector3.Lerp(standardPos, abovePos, 0.5f);
    checkPoints[3] = Vector3.Lerp(standardPos, abovePos, 0.75f);

    // The last is the abovePos.
    checkPoints[4] = abovePos;

    // Run through the check points...
    for(var i = 0; i < checkPoints.Length; i++)
    {
        // ... if the camera can see the player...
        if(ViewingPosCheck(checkPoints[i]))
            // ... break from the loop.
            break;
    }

    // Lerp the camera's position between it's current position and it's new position.
    transform.position = Vector3.Lerp(transform.position, newPos, smooth * Time.deltaTime);

    // Make sure the camera is looking at the player.
    SmoothLookAt();
}


function ViewingPosCheck (checkPos : Vector3) : boolean
{
    var hit : RaycastHit;

    // If a raycast from the check position to the player hits something...
    if(Physics.Raycast(checkPos, player.position - checkPos, hit, relCameraPosMag))
        // ... if it is not the player...
        if(hit.transform != player)
            // This position isn't appropriate.
            return false;

    // If we haven't hit anything or we've hit the player, this is an appropriate position.
    newPos = checkPos;
    return true;
}


function SmoothLookAt ()
{
    // Create a vector from the camera towards the player.
    var relPlayerPosition : Vector3 = player.position - transform.position;

    // Create a rotation based on the relative position of the player being the forward vector.
    var lookAtRotation : Quaternion = Quaternion.LookRotation(relPlayerPosition, Vector3.up);

    // Lerp the camera's rotation between it's current rotation and the rotation that looks at the player.
    transform.rotation = Quaternion.Lerp(transform.rotation, lookAtRotation, smooth * Time.deltaTime);
}