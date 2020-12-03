using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BuildingSubcomponent : MonoBehaviour
{
    public SubComponent SubComponent { get; private set; }
    public int Height { get; private set; }

    private static Color selectedColor = Color.cyan;

    private MeshRenderer[] meshes;
    private Color unselectedColor = Color.white;

    public void Initialise(SubComponent subcomponent, int height)
    {
        SubComponent = subcomponent;
        meshes = GetComponentsInChildren<MeshRenderer>();
        unselectedColor = meshes[0].material.color;
        Height = height;
    }

    private void OnMouseEnter()
    {
        foreach(var mesh in meshes)
            mesh.material.color = selectedColor;
        GamificationManager.Instance.DisplaySubComponentInfo(SubComponent, this);
    }

    private void OnMouseExit()
    {
        foreach (var mesh in meshes)
            mesh.material.color = unselectedColor;
        GamificationManager.Instance.HideSubComponentInfo();
    }

    private void OnMouseDown()
    {
        //GamificationManager.Instance.DisplaySubComponentInfo(SubComponent);
    }
}
