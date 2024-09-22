<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RentNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $messageContent;

    /**
     * Create a new message instance.
     *
     * @param  \App\Models\User  $user
     * @param  string  $messageContent
     */
    public function __construct($user, $messageContent)
    {
        $this->user = $user;
        $this->messageContent = $messageContent;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.rent_notification')
                    ->with([
                        'user' => $this->user,
                        'messageContent' => $this->messageContent,
                    ]);
    }
}
