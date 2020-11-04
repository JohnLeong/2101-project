using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BuildingIndicator : MonoBehaviour
{
    private static Color unselectedColor = Color.yellow;
    private static Color selectedColor = Color.red;

    private void Awake()
    {
        GetComponent<MeshRenderer>().material.color = unselectedColor;
    }

    private void OnMouseEnter()
    {
        GetComponent<MeshRenderer>().material.color = selectedColor;
    }

    private void OnMouseExit()
    {
        GetComponent<MeshRenderer>().material.color = unselectedColor;
    }

    private void OnMouseDown()
    {
        GamificationManager.Instance.DisplayComponentInfo(transform.parent.GetComponent<Building>().Component);
    }
}
