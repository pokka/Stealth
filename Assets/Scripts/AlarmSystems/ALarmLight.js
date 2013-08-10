#pragma strict

public var fadeSpeed : float = 2f;          // How fast the light fades between intensities.
public var highIntensity : float = 2f;      // The maximum intensity of the light whilst the alarm is on.
public var lowIntensity : float = 0.5f;     // The minimum intensity of the light whilst the alarm is on.
public var changeMargin : float = 0.2f;     // The margin within which the target intensity is changed.
public var alarmOn : boolean;               // Whether or not the alarm is on.


private var targetIntensity : float;        // The intensity that the light is aiming for currently.


function Awake ()
{
    // When the level starts we want the light to be "off".
    light.intensity = 0f;

    // When the alarm starts for the first time, the light should aim to have the maximum intensity.
    targetIntensity = highIntensity;
}


function Update ()
{
    // If the light is on...
    if(alarmOn)
    {
        // ... Lerp the light's intensity towards the current target.
        light.intensity = Mathf.Lerp(light.intensity, targetIntensity, fadeSpeed * Time.deltaTime);

        // Check whether the target intensity needs changing and change it if so.
        CheckTargetIntensity();
    }
    else
        // Otherwise fade the light's intensity to zero.
        light.intensity = Mathf.Lerp(light.intensity, 0f, fadeSpeed * Time.deltaTime);
}


function CheckTargetIntensity ()
{
    // If the difference between the target and current intensities is less than the change margin...
    if(Mathf.Abs(targetIntensity - light.intensity) < changeMargin)
    {
        // ... if the target intensity is high...
        if(targetIntensity == highIntensity)
            // ... then set the target to low.
            targetIntensity = lowIntensity;
        else
            // Otherwise set the targer to high.
            targetIntensity = highIntensity;
    }
}