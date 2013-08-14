#pragma strict

class AnimatorSetup
{
    public var speedDampTime : float = 0.1f;        // Damping time for the Speed parameter.
    public var angularSpeedDampTime : float = 0.7f; // Damping time for the AngularSpeed parameter
    public var angleResponseTime : float = 0.6f;    // Response time for turning an angle into angularSpeed.


    private var anim : Animator;                    // Reference to the animator component.
    private var hash : HashIDs;                     // Reference to the HashIDs script.


    // Constructor
    public function AnimatorSetup(animator : Animator, hashIDs : HashIDs)
    {
        anim = animator;
        hash = hashIDs;
    }


    public function Setup(speed : float, angle : float)
    {
        // Angular speed is the number of degrees per second.
        var angularSpeed : float = angle / angleResponseTime;

        // Set the mecanim parameters and apply the appropriate damping to them.
        anim.SetFloat(hash.speedFloat, speed, speedDampTime, Time.deltaTime);
        anim.SetFloat(hash.angularSpeedFloat, angularSpeed, angularSpeedDampTime, Time.deltaTime);
    }
}