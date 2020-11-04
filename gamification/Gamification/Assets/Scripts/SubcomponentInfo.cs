using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class SubcomponentInfo : MonoBehaviour
{
    [SerializeField]
    private Text componentName = null;
    [SerializeField]
    private Text componentComments = null;
    [SerializeField]
    private Vector3 displayOffset;

    private float buildingHeightOffset = 0.625f;

    public void Display(SubComponent subcomponent, BuildingSubcomponent buildingSubcomponent)
    {
        gameObject.SetActive(true);
        transform.position = buildingSubcomponent.transform.position + displayOffset + new Vector3(0.0f, (buildingSubcomponent.Height * buildingHeightOffset) * 0.5f);
        componentName.text = subcomponent.Name;
    }
    public void Hide()
    {
        gameObject.SetActive(false);
    }

    public void Close()
    {
        gameObject.SetActive(false);
    }
}
