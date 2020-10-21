using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Building : MonoBehaviour
{
    public ModuleComponent Component { get; set; }

    private void OnMouseDown()
    {
        Debug.Log("Hello");
    }
}
