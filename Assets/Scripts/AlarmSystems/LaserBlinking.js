#pragma strict

public var onTime : float;          // Amount of time in seconds the laser is on for.
public var offTime : float;         // Amount of time in seconds the laser is off for.


private var timer : float;          // Timer to time the laser blinking.


function Update ()
{
    // Increment the timer by the amount of time since the last frame.
    timer += Time.deltaTime;

    // If the beam is on and the onTime has been reached...
    if(renderer.enabled && timer >= onTime)
        // Switch the beam.
        SwitchBeam();

    // If the beam is off and the offTime has been reached...
    if(!renderer.enabled && timer >= offTime)
        // Switch the beam.
        SwitchBeam();
}


function SwitchBeam ()
{
    // Reset the timer.
    timer = 0f;

    // Switch whether the beam and light are on or off.
    renderer.enabled = !renderer.enabled;
    light.enabled = !light.enabled;
}