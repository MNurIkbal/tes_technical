<?php

namespace App\Http\Controllers;

use App\Models\ScoreModel;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class GameController extends Controller
{
    public function submitScore(Request $request)
    {
        $playerId = $request->input('player_id');
        $score = $request->input('score',0);

        if (!$playerId || !$score) {
            return response()->json(['message' => 'Invalid data'], 400);
        }

        $player = ScoreModel::find($playerId);
        if (!$player) {
            return response()->json(['message' => 'Player not found'], 404);
        }

        $player->update([
            'score' => $score,
            'updated_at' => Carbon::now()
        ]);

        $redis = app('redis');

        $redis->zadd('leaderboard', $score, $player->name);

        return response()->json(['message' => 'Score saved']);
    }

    public function leaderboard()
    {
        $data = Redis::zrevrange('leaderboard', 0, 10, 'WITHSCORES');

        $result = [];

        foreach ($data as $name => $score) {
            $result[] = [
                'name' => $name,
                'score' => (int) $score
            ];
        }

        return response()->json($result);
    }

    public function registerPlayer(Request $request)
    {
        $name = $request->input('name');

        if (!$name) {
            return response()->json(['message' => 'Name required'], 400);
        }

        $query = ScoreModel::where('name', $name)->first();
        if ($query) {
            return response()->json(['message' => 'Name already exists'], 400);
        }

        $score = ScoreModel::create([
            'name' => $name,
            'score' => 0,
            'created_at' => Carbon::now(),
        ]);

        return response()->json([
            'player_id' => $score->id,
            'name' => $name
        ]);
    }
}
