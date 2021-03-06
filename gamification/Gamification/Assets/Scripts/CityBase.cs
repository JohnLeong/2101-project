﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CityBase : MonoBehaviour
{
    [Header("Colors")]
    [SerializeField]
    private Color groundColor = Color.white;
    [SerializeField]
    private Color treeColor = Color.green;

    [Header("SceneObjects")]
    [SerializeField]
    private MeshRenderer[] ground = null;
    [SerializeField]
    private MeshRenderer[] trees = null;


    void Awake()
    {
        foreach (var mesh in ground)
            mesh.material.color = groundColor;

        List<Material> mat = new List<Material>();
        foreach (var mesh in trees)
        {
            mesh.GetMaterials(mat);
            mat[1].color = treeColor;
            mat.Clear();
        }

    }


}
