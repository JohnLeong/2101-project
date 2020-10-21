using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BuildingSubcomponent : MonoBehaviour
{
    public SubComponent SubComponent { get; private set; }

    private static Color selectedColor = Color.red;

    private MeshRenderer[] meshes;
    private Color unselectedColor = Color.white;

    public void Initialise(SubComponent subcomponent)
    {
        SubComponent = subcomponent;
        meshes = GetComponentsInChildren<MeshRenderer>();
        unselectedColor = meshes[0].material.color;
    }

    private void OnMouseEnter()
    {
        foreach(var mesh in meshes)
            mesh.material.color = selectedColor;
    }

    private void OnMouseExit()
    {
        foreach (var mesh in meshes)
            mesh.material.color = unselectedColor;
    }

    private void OnMouseDown()
    {
        GamificationManager.Instance.DisplaySubComponentInfo(SubComponent);
    }
}
