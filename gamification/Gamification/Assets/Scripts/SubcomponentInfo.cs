using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class SubcomponentInfo : MonoBehaviour
{
    [SerializeField]
    private Text componentName;
    [SerializeField]
    private Text componentComments;

    public void Display(SubComponent subcomponent)
    {
        gameObject.SetActive(true);
        componentName.text = subcomponent.Name;
    }

    public void Close()
    {
        gameObject.SetActive(false);
    }
}
