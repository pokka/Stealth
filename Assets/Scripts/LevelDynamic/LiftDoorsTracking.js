#pragma strict

public var doorSpeed : float = 7f;          // How quickly the inner doors will track the outer doors.


private var leftOuterDoor : Transform;      // Reference to the transform of the left outer door.
private var rightOuterDoor : Transform;     // Reference to the transform of the right outer door.
private var leftInnerDoor : Transform;      // Reference to the transform of the left inner door.
private var rightInnerDoor : Transform;     // Reference to the transform of the right inner door.
private var leftClosedPosX : float;         // The initial x component of position of the left doors.
private var rightClosedPosX : float;        // The initial x component of position of the right doors.


function Awake ()
{
    // Setting up the references.
    leftOuterDoor = GameObject.Find("door_exit_outer_left_001").transform;
    rightOuterDoor = GameObject.Find("door_exit_outer_right_001").transform;
    leftInnerDoor = GameObject.Find("door_exit_inner_left_001").transform;
    rightInnerDoor = GameObject.Find("door_exit_inner_right_001").transform;

    // Setting the closed x position of the doors.
    leftClosedPosX = leftInnerDoor.position.x;
    rightClosedPosX = rightInnerDoor.position.x;
}


function MoveDoors (newLeftXTarget : float, newRightXTarget : float)
{
    // Create a float that is a proportion of the distance from the left inner door's x position to it's target x position.
    var newX : float = Mathf.Lerp(leftInnerDoor.position.x, newLeftXTarget, doorSpeed * Time.deltaTime);

    // Move the left inner door to it's new position proportionally closer to it's target.
    leftInnerDoor.position = new Vector3(newX, leftInnerDoor.position.y, leftInnerDoor.position.z);

    // Reassign the float for the right door's x position.
    newX = Mathf.Lerp(rightInnerDoor.position.x, newRightXTarget, doorSpeed * Time.deltaTime);

    // Move the right inner door similarly.
    rightInnerDoor.position = new Vector3(newX, rightInnerDoor.position.y, rightInnerDoor.position.z);
}


public function DoorFollowing ()
{
    // Move the inner doors towards the outer doors.
    MoveDoors(leftOuterDoor.position.x, rightOuterDoor.position.x);
}


public function CloseDoors ()
{
    // Move the inner doors towards their closed position.
    MoveDoors(leftClosedPosX, rightClosedPosX);
}