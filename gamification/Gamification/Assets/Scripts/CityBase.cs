using System.Collections;
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
    private MeshRenderer ground;
    [SerializeField]
    private MeshRenderer[] trees;


    void Awake()
    {
        ground.material.color = groundColor;
        List<Material> mat = new List<Material>();
        foreach (var mesh in trees)
        {
            mesh.GetMaterials(mat);
            mat[1].color = treeColor;
            mat.Clear();
        }

    }


}
