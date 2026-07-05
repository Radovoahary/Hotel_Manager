<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = ['client_id', 'room_id', 'check_in_date', 'check_out_date', 'total_price', 'status'];

    //Relation avec le client
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    //Relation avec la chambre
    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
