<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScoreModel extends Model
{
    protected $table = 'score';
    public $timestamps = false;

    protected $fillable = [
        'name',
        'score',
        'created_at',
        'updated_at'
    ];
}