using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AnimatorOffset : MonoBehaviour
{
    [SerializeField]
    private string stateName = "";
    [SerializeField]
    private bool randomOffset = true;
    [SerializeField]
    private float offset = 0.0f;

    private void Awake()
    {
        GetComponent<Animator>().Play(stateName, 0, randomOffset ? Random.Range(0.0f, 1.0f) : offset);
    }
}
